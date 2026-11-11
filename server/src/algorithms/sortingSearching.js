/**
 * Merge Sort, Binary Search, and Linear Search implementations for Restaurant data.
 * 
 * Merge Sort:
 *   - Time Complexity: O(N log N) in all cases (best, average, worst)
 *   - Space Complexity: O(N) auxiliary space
 * 
 * Binary Search:
 *   - Time Complexity: O(log N)
 *   - Space Complexity: O(1)
 * 
 * Linear Search:
 *   - Time Complexity: O(N)
 *   - Space Complexity: O(1)
 */

export function mergeSortRestaurants(restaurants, sortBy = 'rating', customerCoords = [77.086, 28.471], trackSteps = true) {
  const steps = [];
  let stepCounter = 0;

  // Comparator definitions
  function compare(a, b) {
    if (sortBy === 'rating') {
      // Descending
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'distance') {
      // Ascending
      const distA = getApproxDistance(a.address?.coordinates, customerCoords);
      const distB = getApproxDistance(b.address?.coordinates, customerCoords);
      return distA - distB;
    }
    if (sortBy === 'delivery_time') {
      // Ascending
      const timeA = parseInt(a.deliveryTime) || 30;
      const timeB = parseInt(b.deliveryTime) || 30;
      return timeA - timeB;
    }
    if (sortBy === 'price') {
      const pMap = { '$': 1, '$$': 2, '$$$': 3 };
      return (pMap[a.priceRange] || 2) - (pMap[b.priceRange] || 2);
    }
    return (b.rating || 0) - (a.rating || 0);
  }

  function merge(left, right, depth) {
    const result = [];
    let i = 0;
    let j = 0;
    const comparisons = [];

    while (i < left.length && j < right.length) {
      const cmp = compare(left[i], right[j]);
      comparisons.push({
        leftItem: left[i].name,
        rightItem: right[j].name,
        chosen: cmp <= 0 ? left[i].name : right[j].name
      });

      if (cmp <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }

    stepCounter++;
    if (trackSteps) {
      steps.push({
        step: stepCounter,
        action: 'MERGE',
        depth,
        leftSubarray: left.map(r => r.name),
        rightSubarray: right.map(r => r.name),
        mergedResult: result.map(r => r.name),
        comparisonsCount: comparisons.length
      });
    }

    return result;
  }

  function sortRecursive(arr, depth = 0) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const leftPart = arr.slice(0, mid);
    const rightPart = arr.slice(mid);

    stepCounter++;
    if (trackSteps) {
      steps.push({
        step: stepCounter,
        action: 'DIVIDE',
        depth,
        originalArraySize: arr.length,
        leftSize: leftPart.length,
        rightSize: rightPart.length,
        description: `Divided array of ${arr.length} restaurants into two halves: Left (${leftPart.length}) & Right (${rightPart.length}).`
      });
    }

    const sortedLeft = sortRecursive(leftPart, depth + 1);
    const sortedRight = sortRecursive(rightPart, depth + 1);

    return merge(sortedLeft, sortedRight, depth);
  }

  const sorted = sortRecursive([...restaurants], 0);

  return {
    sorted,
    totalRestaurants: restaurants.length,
    sortBy,
    totalSteps: steps.length,
    steps,
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)'
  };
}

/**
 * Binary Search on a name-sorted restaurant array.
 */
export function binarySearchRestaurant(sortedRestaurants, targetName, trackSteps = true) {
  const steps = [];
  const target = targetName.toLowerCase().trim();

  let low = 0;
  let high = sortedRestaurants.length - 1;
  let foundIndex = -1;
  let comparisons = 0;

  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);
    const currentRest = sortedRestaurants[mid];
    const currentName = (currentRest.name || '').toLowerCase();

    const comparisonResult = target.localeCompare(currentName);

    if (trackSteps) {
      steps.push({
        step: comparisons,
        low,
        high,
        mid,
        candidateName: currentRest.name,
        targetName,
        comparison: comparisonResult === 0 ? 'MATCH_FOUND' : comparisonResult < 0 ? 'TARGET_IS_SMALLER (Go Left)' : 'TARGET_IS_LARGER (Go Right)',
        subarrayWindow: sortedRestaurants.slice(low, high + 1).map(r => r.name)
      });
    }

    if (comparisonResult === 0) {
      foundIndex = mid;
      break;
    } else if (comparisonResult < 0) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return {
    found: foundIndex !== -1,
    foundIndex,
    restaurant: foundIndex !== -1 ? sortedRestaurants[foundIndex] : null,
    totalComparisons: comparisons,
    steps,
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)'
  };
}

/**
 * Linear Search for flexible partial matches.
 */
export function linearSearchRestaurants(restaurants, searchTerm, trackSteps = true) {
  const steps = [];
  const term = searchTerm.toLowerCase().trim();
  const matched = [];
  let comparisons = 0;

  for (let i = 0; i < restaurants.length; i++) {
    comparisons++;
    const r = restaurants[i];
    const nameLower = (r.name || '').toLowerCase();
    const cuisinesLower = (r.cuisines || []).join(' ').toLowerCase();
    const isMatch = nameLower.includes(term) || cuisinesLower.includes(term);

    if (isMatch) matched.push(r);

    if (trackSteps) {
      steps.push({
        index: i,
        name: r.name,
        testedTerm: term,
        matched: isMatch
      });
    }
  }

  return {
    matched,
    totalMatches: matched.length,
    totalComparisons: comparisons,
    steps: trackSteps ? steps.slice(0, 20) : [], // Cap display steps for readability
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  };
}

function getApproxDistance(coords1, coords2) {
  if (!coords1 || !coords2) return 3.0;
  const dx = (coords1[0] - coords2[0]) * 111; // ~111 km per degree
  const dy = (coords1[1] - coords2[1]) * 111;
  return Math.sqrt(dx * dx + dy * dy);
}
