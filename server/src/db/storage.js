import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.data = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = [];
        this.save();
      }
    } catch (err) {
      console.error(`Error loading collection ${this.name}:`, err.message);
      this.data = [];
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error saving collection ${this.name}:`, err.message);
    }
  }

  matchFilter(doc, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;

    for (const [key, value] of Object.entries(filter)) {
      if (key === '$or' && Array.isArray(value)) {
        const anyMatch = value.some(subFilter => this.matchFilter(doc, subFilter));
        if (!anyMatch) return false;
        continue;
      }

      // Handle nested property paths like "address.city"
      let docVal = doc;
      if (key.includes('.')) {
        const parts = key.split('.');
        for (const p of parts) {
          docVal = docVal ? docVal[p] : undefined;
        }
      } else {
        docVal = doc[key];
        if (key === '_id' && docVal === undefined && doc.id) {
          docVal = doc.id;
        }
      }

      // If comparing ID string
      const compareVal = (value && value._id) ? value._id : value;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (value.$regex !== undefined) {
          const reg = new RegExp(value.$regex, value.$options || 'i');
          if (!reg.test(String(docVal || ''))) return false;
        } else if (value.$in !== undefined && Array.isArray(value.$in)) {
          if (!value.$in.map(String).includes(String(docVal))) return false;
        } else if (value.$nin !== undefined && Array.isArray(value.$nin)) {
          if (value.$nin.map(String).includes(String(docVal))) return false;
        } else if (value.$gte !== undefined) {
          if (docVal < value.$gte) return false;
        } else if (value.$lte !== undefined) {
          if (docVal > value.$lte) return false;
        } else if (value.$gt !== undefined) {
          if (docVal <= value.$gt) return false;
        } else if (value.$lt !== undefined) {
          if (docVal >= value.$lt) return false;
        } else if (value.$ne !== undefined) {
          if (String(docVal) === String(value.$ne)) return false;
        }
      } else if (Array.isArray(docVal) && !Array.isArray(compareVal)) {
        if (!docVal.map(String).includes(String(compareVal))) return false;
      } else {
        if (String(docVal) !== String(compareVal)) return false;
      }
    }
    return true;
  }

  async find(filter = {}, options = {}) {
    let results = this.data.filter(doc => this.matchFilter(doc, filter));

    if (options.sort) {
      const [field, direction] = Object.entries(options.sort)[0] || [];
      if (field) {
        results.sort((a, b) => {
          const valA = a[field] ?? '';
          const valB = b[field] ?? '';
          if (direction === -1 || direction === 'desc') {
            return valA < valB ? 1 : valA > valB ? -1 : 0;
          }
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        });
      }
    }

    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results.map(doc => ({ ...doc }));
  }

  async findOne(filter = {}) {
    const list = await this.find(filter, { limit: 1 });
    return list.length ? { ...list[0] } : null;
  }

  async findById(id) {
    if (!id) return null;
    const stringId = String(id);
    const item = this.data.find(d => String(d._id) === stringId || String(d.id) === stringId);
    return item ? { ...item } : null;
  }

  async create(doc) {
    const _id = doc._id || generateId();
    const newDoc = {
      ...doc,
      _id,
      id: _id,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.unshift(newDoc);
    this.save();
    return { ...newDoc };
  }

  async insertMany(docs) {
    const created = [];
    for (const d of docs) {
      const item = await this.create(d);
      created.push(item);
    }
    return created;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const stringId = String(id);
    const index = this.data.findIndex(d => String(d._id) === stringId || String(d.id) === stringId);
    if (index === -1) return null;

    let target = { ...this.data[index] };

    if (update.$set) {
      target = { ...target, ...update.$set };
    }
    if (update.$inc) {
      for (const [key, incVal] of Object.entries(update.$inc)) {
        target[key] = (Number(target[key]) || 0) + Number(incVal);
      }
    }
    if (update.$push) {
      for (const [key, pushVal] of Object.entries(update.$push)) {
        if (!Array.isArray(target[key])) target[key] = [];
        target[key].push(pushVal);
      }
    }

    // Direct object update without mongo operators
    for (const [key, val] of Object.entries(update)) {
      if (!key.startsWith('$')) {
        target[key] = val;
      }
    }

    target.updatedAt = new Date().toISOString();
    this.data[index] = target;
    this.save();

    return options.new === false ? { ...this.data[index] } : { ...target };
  }

  async updateMany(filter, update) {
    let count = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.matchFilter(this.data[i], filter)) {
        let target = { ...this.data[i] };
        if (update.$set) target = { ...target, ...update.$set };
        if (update.$inc) {
          for (const [key, incVal] of Object.entries(update.$inc)) {
            target[key] = (Number(target[key]) || 0) + Number(incVal);
          }
        }
        for (const [key, val] of Object.entries(update)) {
          if (!key.startsWith('$')) target[key] = val;
        }
        target.updatedAt = new Date().toISOString();
        this.data[i] = target;
        count++;
      }
    }
    if (count > 0) this.save();
    return { modifiedCount: count };
  }

  async findByIdAndDelete(id) {
    const stringId = String(id);
    const index = this.data.findIndex(d => String(d._id) === stringId || String(d.id) === stringId);
    if (index === -1) return null;
    const removed = this.data.splice(index, 1)[0];
    this.save();
    return removed;
  }

  async deleteMany(filter = {}) {
    const initialLen = this.data.length;
    this.data = this.data.filter(d => !this.matchFilter(d, filter));
    const deletedCount = initialLen - this.data.length;
    if (deletedCount > 0) this.save();
    return { deletedCount };
  }

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  }
}

class Database {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Collection(name));
    }
    return this.collections.get(name);
  }
}

export const db = new Database();

export const Users = db.collection('users');
export const Restaurants = db.collection('restaurants');
export const MenuItems = db.collection('menuItems');
export const Orders = db.collection('orders');
export const GroupOrders = db.collection('groupOrders');
export const Reviews = db.collection('reviews');
export const Categories = db.collection('categories');
