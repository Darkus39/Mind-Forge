// ─── MINDFORGE QUESTION BANK ───
// 300+ questions | All DSA topics | Hard/Killer focused

const CATEGORIES = [

// ════════════════════════════════════════════
// 1. DSA — Full Coverage
// ════════════════════════════════════════════
{
  id:'dsa', name:'DSA', icon:'⚔️', color:'#00e5ff',
  desc:'Arrays, trees, graphs, DP, sorting — killer problems',
  questions:[

    // ── PYTHON LISTS ──
    {
      type:'PYTHON LIST', diff:'medium',
      text:'What is the time complexity of inserting at index 0 of a Python list with n elements?',
      options:['O(1)','O(log n)','O(n)','O(n²)'],
      answer:2,
      explain:'Python lists are dynamic arrays. Inserting at index 0 requires shifting all n existing elements one position to the right → O(n). Appending to the end is O(1) amortized. Prefer deque for O(1) front insertions.',
      complexity:'Time: O(n) | Space: O(1)'
    },
    {
      type:'PYTHON LIST', diff:'hard',
      text:'What does this list comprehension output?',
      code:`nums = [1,2,3,4,5]
result = [x**2 <span class="kw">for</span> x <span class="kw">in</span> nums <span class="kw">if</span> x % 2 != 0]
print(result)`,
      options:['[1, 4, 9, 16, 25]','[1, 9, 25]','[4, 16]','[2, 4]'],
      answer:1,
      explain:'Filters odd numbers (1,3,5) then squares → [1,9,25]. Comprehensions evaluate filter first, then expression. Equivalent to a for-loop with an if-statement inside.',
      complexity:'Time: O(n) | Space: O(n)'
    },
    {
      type:'PYTHON LIST', diff:'hard',
      text:'What is the output of this slicing?',
      code:`a = [0,1,2,3,4,5,6,7,8,9]
print(a[2:8:2])`,
      options:['[2,4,6]','[2,4,6,8]','[3,5,7]','[2,3,4,5,6,7]'],
      answer:0,
      explain:'[2:8:2] = start index 2, stop before 8, step 2. Indices 2,4,6 → values [2,4,6]. Index 8 excluded (stop is exclusive).',
      complexity:'Time: O(k) where k = slice length'
    },
    {
      type:'PYTHON LIST', diff:'killer',
      text:'You need O(1) append, O(1) pop from both ends, and O(n) random access. Which is best?',
      options:['Python list','collections.deque','array.array','linked list'],
      answer:1,
      explain:'deque: O(1) append/pop from both ends. Python list only O(1) at right end; O(n) at left. deque does NOT support O(1) random access — O(n). No standard structure gives both O(1) ends AND O(1) random access.',
      complexity:'deque: O(1) ends | O(n) middle access'
    },
    {
      type:'PYTHON LIST', diff:'medium',
      text:'What is the result of this 2D list creation?',
      code:`a = [[0]*3 <span class="kw">for</span> _ <span class="kw">in</span> range(3)]
a[0][0] = 9
print(a)`,
      options:['[[9,0,0],[0,0,0],[0,0,0]]','[[9,0,0],[9,0,0],[9,0,0]]','[[0,0,0],[0,0,0],[0,0,0]]','Error'],
      answer:0,
      explain:'Comprehension creates 3 INDEPENDENT inner lists. a[0][0]=9 affects only row 0. Dangerous pattern: [[0]*3]*3 creates 3 references to the SAME inner list — changing one changes all. Always use comprehension for 2D lists.',
      complexity:'Space: O(rows × cols)'
    },

    // ── 2D NUMPY ARRAYS ──
    {
      type:'2D NUMPY', diff:'medium',
      text:'What does this NumPy slice return?',
      code:`<span class="kw">import</span> numpy <span class="kw">as</span> np
a = np.array([[1,2,3],[4,5,6],[7,8,9]])
print(a[1:, :2])`,
      options:['[[4,5],[7,8]]','[[1,2],[4,5]]','[[5,6],[8,9]]','[[4,5,6],[7,8,9]]'],
      answer:0,
      explain:'a[1:, :2]: rows from index 1 onwards (rows 1,2), columns up to but not including 2 (cols 0,1). Rows [4,5,6] and [7,8,9], cols 0-1 → [[4,5],[7,8]]. NumPy slices are views — O(1) space.',
      complexity:'Time: O(1) view | Space: O(1)'
    },
    {
      type:'2D NUMPY', diff:'hard',
      text:'Result of np.dot(A,B)?',
      code:`A = np.array([[1,2],[3,4]])
B = np.array([[5,6],[7,8]])
print(np.dot(A,B))`,
      options:['[[19,22],[43,50]]','[[5,12],[21,32]]','[[12,16],[26,36]]','[[6,8],[10,12]]'],
      answer:0,
      explain:'Matrix multiply: result[i][j]=Σ A[i][k]*B[k][j]. [0][0]: 1×5+2×7=19, [0][1]: 1×6+2×8=22, [1][0]: 3×5+4×7=43, [1][1]: 3×6+4×8=50. O(n³) but uses optimized BLAS routines.',
      complexity:'Time: O(n³) | Space: O(n²)'
    },
    {
      type:'2D NUMPY', diff:'hard',
      text:'What does np.argmax(a, axis=0) return?',
      code:`a = np.array([[3,1,4],[1,5,9],[2,6,5]])`,
      options:['[0, 2, 1]','[2, 1, 1]','[1, 2, 2]','[0, 1, 2]'],
      answer:0,
      explain:'axis=0 = along rows, find max index per COLUMN. Col 0: max(3,1,2)=3 at row 0. Col 1: max(1,5,6)=6 at row 2. Col 2: max(4,9,5)=9 at row 1. → [0,2,1]. axis=1 gives max per row.',
      complexity:'Time: O(m×n) | Space: O(n)'
    },
    {
      type:'2D NUMPY', diff:'killer',
      text:'Most efficient way to compute row-wise dot products of two (n×d) matrices without a loop?',
      options:['np.dot(A, B)','np.sum(A * B, axis=1)','np.multiply(A, B)','np.tensordot(A, B, axes=1)'],
      answer:1,
      explain:'np.sum(A*B, axis=1): element-wise multiply then sum along columns → vector of row dot products in O(n×d). np.dot(A,B) gives full matrix product O(n²d). Critical pattern in ML for cosine similarity and distance computations.',
      complexity:'Time: O(n×d) | Space: O(n)'
    },
    {
      type:'2D NUMPY', diff:'killer',
      text:'A 1000×1000 float64 NumPy array uses how much memory?',
      options:['1 MB','8 MB','4 MB','16 MB'],
      answer:1,
      explain:'float64 = 8 bytes. 1000×1000 = 1,000,000 × 8 = 8,000,000 bytes = 8 MB. Matters for GPU transfers and cache efficiency. float32 halves to 4 MB — acceptable in ML with negligible accuracy loss.',
      complexity:'Memory = rows × cols × dtype_bytes'
    },

    // ── LINKED LIST ──
    {
      type:'LINKED LIST', diff:'medium',
      text:'Floyd\'s cycle detection: does this list have a cycle? 1→2→3→4→5→3 (loops back)',
      code:`<span class="kw">def</span> <span class="fn">has_cycle</span>(head):
  slow = fast = head
  <span class="kw">while</span> fast <span class="kw">and</span> fast.next:
    slow = slow.next
    fast = fast.next.next
    <span class="kw">if</span> slow == fast: <span class="kw">return</span> <span class="cls">True</span>
  <span class="kw">return</span> <span class="cls">False</span>`,
      options:['False','True','None','Infinite loop'],
      answer:1,
      explain:'Floyd\'s tortoise and hare: slow moves 1 step, fast moves 2. If cycle exists, fast laps slow and they meet. Cycle 3→4→5→3 guarantees they meet → True. O(n) time, O(1) space — no hashset needed.',
      complexity:'Time: O(n) | Space: O(1)'
    },
    {
      type:'LINKED LIST', diff:'hard',
      text:'Reverse a linked list iteratively. After the loop on 1→2→3→None, what are prev and curr?',
      code:`prev, curr = None, head
<span class="kw">while</span> curr:
  nxt = curr.next
  curr.next = prev
  prev = curr
  curr = nxt`,
      options:['prev=3, curr=None','prev=None, curr=3','prev=1, curr=None','prev=3, curr=1'],
      answer:0,
      explain:'Walk: iter1→prev=1,curr=2. iter2→prev=2,curr=3. iter3→prev=3,curr=None. Loop ends. prev points to new head (node 3). List is now 3→2→1→None. Return prev.',
      complexity:'Time: O(n) | Space: O(1)'
    },
    {
      type:'LINKED LIST', diff:'hard',
      text:'Find middle of linked list in one pass. What does this return?',
      code:`<span class="kw">def</span> <span class="fn">middle</span>(head):
  slow = fast = head
  <span class="kw">while</span> fast <span class="kw">and</span> fast.next:
    slow = slow.next
    fast = fast.next.next
  <span class="kw">return</span> slow`,
      options:['First node','Middle node','Last node','None'],
      answer:1,
      explain:'Fast moves 2×. When fast hits end, slow is at middle. For even-length, returns second middle. Used in merge sort on linked lists and palindrome checks.',
      complexity:'Time: O(n) | Space: O(1)'
    },
    {
      type:'LINKED LIST', diff:'killer',
      text:'Merge two sorted linked lists of lengths m and n. Optimal time complexity?',
      options:['O(n)','O(n log n)','O(m + n)','O(m × n)'],
      answer:2,
      explain:'At each step advance one pointer. Total steps = m + n. Each O(1) → O(m+n). Recursive stack depth is O(m+n) — for large lists use iterative version to avoid stack overflow.',
      complexity:'Time: O(m+n) | Space: O(m+n) recursive'
    },
    {
      type:'LINKED LIST', diff:'killer',
      text:'Remove Nth node from end of list in ONE pass. Key insight?',
      options:['Use a stack','Two pointers with N+1 gap','Count length first','Reverse the list'],
      answer:1,
      explain:'Two pointers: advance fast N+1 steps ahead. Move both until fast is None. Slow is just before the target node. Set slow.next = slow.next.next. The N+1 gap ensures when fast hits None, slow is at position (length-N-1).',
      complexity:'Time: O(n) | Space: O(1)'
    },

    // ── STACK ──
    {
      type:'STACK', diff:'medium',
      text:'Valid parentheses checker returns what for "({[]})"?',
      code:`<span class="kw">def</span> <span class="fn">valid</span>(s):
  stack = []
  pairs = {')':'(', ']':'[', '}':'{'}
  <span class="kw">for</span> c <span class="kw">in</span> s:
    <span class="kw">if</span> c <span class="kw">in</span> '([{': stack.append(c)
    <span class="kw">elif</span> <span class="kw">not</span> stack <span class="kw">or</span> stack[-1] != pairs[c]:
      <span class="kw">return</span> <span class="cls">False</span>
    <span class="kw">else</span>: stack.pop()
  <span class="kw">return</span> <span class="kw">not</span> stack`,
      options:['True','False','Error','None'],
      answer:0,
      explain:'Push open brackets. For close brackets check stack top. "({[]})": push (,{,[. ] matches [ pop, } matches { pop, ) matches ( pop. Stack empty → True.',
      complexity:'Time: O(n) | Space: O(n)'
    },
    {
      type:'STACK', diff:'hard',
      text:'Next Greater Element for [4,1,2,3]. Output?',
      code:`<span class="kw">def</span> <span class="fn">next_greater</span>(nums):
  res = [-1]*len(nums)
  stack = []
  <span class="kw">for</span> i,v <span class="kw">in</span> enumerate(nums):
    <span class="kw">while</span> stack <span class="kw">and</span> nums[stack[-1]] < v:
      res[stack.pop()] = v
    stack.append(i)
  <span class="kw">return</span> res`,
      options:['[-1,2,3,-1]','[-1,2,3,4]','[4,2,3,-1]','[-1,-1,-1,-1]'],
      answer:0,
      explain:'Monotonic decreasing stack of indices. 4→push 0. 1→push 1. 2→pop 1(res[1]=2),push 2. 3→pop 2(res[2]=3),push 3. End: indices 0,3 remain → -1. Result: [-1,2,3,-1].',
      complexity:'Time: O(n) | Space: O(n)'
    },
    {
      type:'STACK', diff:'hard',
      text:'Largest rectangle in histogram [2,1,5,6,2,3]. Max area?',
      options:['10','12','8','6'],
      answer:0,
      explain:'Monotonic stack: maintain increasing stack. When shorter bar found, pop and compute area using popped height, current index as right boundary. Best spans heights 5,6 → area = 5×2 = 10.',
      complexity:'Time: O(n) | Space: O(n)'
    },
    {
      type:'STACK', diff:'killer',
      text:'Stack that returns min in O(1). Correct approach?',
      options:['Sort on every push','Maintain a parallel min-stack','Use a heap','Store min in each node'],
      answer:1,
      explain:'Parallel min_stack: on push(x), push min(x, min_stack[-1]) to min_stack. On pop, pop both. get_min() = min_stack[-1]. All O(1). Space O(n) total.',
      complexity:'Time: O(1) all ops | Space: O(n)'
    },

    // ── QUEUE ──
    {
      type:'QUEUE', diff:'medium',
      text:'Queue using two stacks. Amortized time of dequeue?',
      options:['O(n) always','O(1) amortized','O(log n)','O(n²)'],
      answer:1,
      explain:'Enqueue to stack1. Dequeue: if stack2 empty, pour all stack1 into stack2. Pop from stack2. Each element moved at most once → amortized O(1). Worst case single dequeue O(n) but total cost across n ops is O(n).',
      complexity:'Amortized O(1) enqueue and dequeue'
    },
    {
      type:'QUEUE', diff:'hard',
      text:'Sliding window maximum [1,3,-1,-3,5,3,6,7] k=3. Output?',
      options:['[3,3,5,5,6,7]','[3,3,3,5,6,7]','[1,3,5,5,6,7]','[3,-1,-3,5,3,6]'],
      answer:0,
      explain:'Monotonic deque of indices (decreasing order). Pop front if out of window, pop back if new element larger. Windows: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, [-3,5,3]→5, [5,3,6]→6, [3,6,7]→7. Result: [3,3,5,5,6,7].',
      complexity:'Time: O(n) | Space: O(k)'
    },
    {
      type:'QUEUE', diff:'killer',
      text:'BFS uses a queue vs DFS uses a stack. What fundamentally changes?',
      options:['No difference','Stack gives BFS, queue gives DFS','Queue gives BFS (level order), stack gives DFS','Queue gives DFS, stack gives BFS'],
      answer:2,
      explain:'Queue (FIFO) → BFS: processes nodes level by level by distance. Stack (LIFO) → DFS: dives deep first. Swapping the data structure literally converts BFS to DFS. Critical interview insight.',
      complexity:'Both O(V+E) for graphs'
    },

    // ── BINARY TREE ──
    {
      type:'BINARY TREE', diff:'medium',
      text:'Inorder traversal of: root=4, left=2(1,3), right=6(5,7)?',
      options:['[4,2,6,1,3,5,7]','[1,2,3,4,5,6,7]','[4,2,1,3,6,5,7]','[1,3,2,5,7,6,4]'],
      answer:1,
      explain:'Inorder = Left→Root→Right → [1,2,3,4,5,6,7]. For a BST inorder always gives sorted order. Preorder(Root→L→R): [4,2,1,3,6,5,7]. Postorder(L→R→Root): [1,3,2,5,7,6,4].',
      complexity:'Time: O(n) | Space: O(h)'
    },
    {
      type:'BINARY TREE', diff:'hard',
      text:'Max depth recursion on a tree of actual depth 4 returns?',
      code:`<span class="kw">def</span> <span class="fn">max_depth</span>(root):
  <span class="kw">if not</span> root: <span class="kw">return</span> 0
  <span class="kw">return</span> 1 + max(max_depth(root.left), max_depth(root.right))`,
      options:['3','4','5','2'],
      answer:1,
      explain:'Base: None→0. Recursive: 1 + max(left_depth, right_depth). For depth 4, deepest leaf is 4 levels from root → returns 4. Stack depth = O(h). Use iterative BFS to avoid stack overflow on very deep trees.',
      complexity:'Time: O(n) | Space: O(h)'
    },
    {
      type:'BINARY TREE', diff:'hard',
      text:'Level order traversal requires which data structure?',
      code:`<span class="kw">from</span> collections <span class="kw">import</span> deque
<span class="kw">def</span> <span class="fn">level_order</span>(root):
  q, res = deque([root]), []
  <span class="kw">while</span> q:
    level = []
    <span class="kw">for</span> _ <span class="kw">in</span> range(len(q)):
      node = q.popleft()
      level.append(node.val)
      <span class="kw">if</span> node.left: q.append(node.left)
      <span class="kw">if</span> node.right: q.append(node.right)
    res.append(level)
  <span class="kw">return</span> res`,
      options:['Stack','Queue (deque)','Heap','HashMap'],
      answer:1,
      explain:'Queue ensures FIFO — process all nodes at current level before next. Inner for-loop (range(len(q))) processes exactly one level per outer iteration. Stack would give DFS instead.',
      complexity:'Time: O(n) | Space: O(w) max width'
    },
    {
      type:'BINARY TREE', diff:'killer',
      text:'Diameter of a binary tree (longest path between any two nodes). Correct approach?',
      options:['BFS from root','DFS tracking left+right height at each node','DFS only on leaves','Preorder traversal'],
      answer:1,
      explain:'At each node, diameter through it = left_height + right_height. DFS: return height to parent, update global max with left+right. Path need not go through root — that is the trap. Single O(n) pass. Naive: computing height separately per node is O(n²).',
      complexity:'Time: O(n) | Space: O(h)'
    },
    {
      type:'BINARY TREE', diff:'killer',
      text:'Serialize/deserialize a binary tree. Which traversal works best?',
      options:['Inorder only','Preorder with null markers','Postorder only','Level order without nulls'],
      answer:1,
      explain:'Preorder with nulls: root first, recurse. Nulls mark missing children. Deserialize consumes values in same order. Inorder alone is ambiguous. Level order also works but needs queue bookkeeping. Preorder is cleanest.',
      complexity:'Time: O(n) | Space: O(n)'
    },

    // ── BST ──
    {
      type:'BST', diff:'medium',
      text:'BST search: average and worst case time complexity?',
      options:['O(log n) always','O(log n) avg, O(n) worst','O(n) always','O(1) avg'],
      answer:1,
      explain:'Balanced BST height O(log n) → O(log n) search. Degenerate BST (sorted inserts) becomes linked list, height O(n) → O(n) worst case. AVL and Red-Black trees guarantee O(log n).',
      complexity:'Avg O(log n) | Worst O(n)'
    },
    {
      type:'BST', diff:'hard',
      text:'Validate BST. What is wrong with only checking node.left.val < node.val locally?',
      code:`<span class="kw">def</span> <span class="fn">is_valid</span>(root, lo=float('-inf'), hi=float('inf')):
  <span class="kw">if not</span> root: <span class="kw">return</span> <span class="cls">True</span>
  <span class="kw">if not</span> (lo < root.val < hi): <span class="kw">return</span> <span class="cls">False</span>
  <span class="kw">return</span> is_valid(root.left, lo, root.val) <span class="kw">and</span> is_valid(root.right, root.val, hi)`,
      options:['Nothing wrong','Misses global bounds — right subtree node could violate ancestor','Too slow','Doesn\'t handle duplicates'],
      answer:1,
      explain:'Local check fails: root=10, right=15, right-right=5. 5<15 locally but 5<10 violates BST globally. Correct: pass min/max bounds down, tightening range at each node.',
      complexity:'Time: O(n) | Space: O(h)'
    },
    {
      type:'BST', diff:'killer',
      text:'Kth smallest in BST. Most efficient approach?',
      options:['Sort all values O(n log n)','Inorder traversal, stop at kth O(k+h)','Level order','Convert to array first'],
      answer:1,
      explain:'BST inorder = sorted. Iterative inorder (stack), count nodes, return at count==k. O(k+h) — stop early. For frequent queries, augment each node with subtree size → O(h) per query.',
      complexity:'Time: O(k+h) | Space: O(h)'
    },

    // ── HASHTABLE ──
    {
      type:'HASHTABLE', diff:'medium',
      text:'Two Sum: find indices summing to target. Optimal complexity?',
      code:`<span class="kw">def</span> <span class="fn">two_sum</span>(nums, target):
  seen = {}
  <span class="kw">for</span> i, n <span class="kw">in</span> enumerate(nums):
    comp = target - n
    <span class="kw">if</span> comp <span class="kw">in</span> seen: <span class="kw">return</span> [seen[comp], i]
    seen[n] = i`,
      options:['O(n²)','O(n log n)','O(n)','O(1)'],
      answer:2,
      explain:'HashMap: for each element check if complement (target-n) is already stored. Single pass, O(1) lookup → O(n) total. Brute force nested loop is O(n²). Canonical hash table optimization.',
      complexity:'Time: O(n) | Space: O(n)'
    },
    {
      type:'HASHTABLE', diff:'hard',
      text:'Python dict lookup worst case time complexity and why?',
      options:['O(1) always','O(n) due to hash collisions','O(log n)','O(n²)'],
      answer:1,
      explain:'Adversarial keys all hashing to same bucket → linear scan → O(n) worst case. Python randomizes hash seeds since 3.3 to prevent DoS. In practice treat as O(1) average.',
      complexity:'Avg O(1) | Worst O(n)'
    },
    {
      type:'HASHTABLE', diff:'hard',
      text:'Group anagrams time complexity using sorted key?',
      code:`<span class="kw">from</span> collections <span class="kw">import</span> defaultdict
<span class="kw">def</span> <span class="fn">group_anagrams</span>(strs):
  d = defaultdict(list)
  <span class="kw">for</span> s <span class="kw">in</span> strs:
    d[tuple(sorted(s))].append(s)
  <span class="kw">return</span> list(d.values())`,
      options:['O(n)','O(n·k log k) where k=max string length','O(n²)','O(n log n)'],
      answer:1,
      explain:'Each of n strings sorted in O(k log k). Total O(n·k log k). Faster alternative: character count tuple key → O(n·k). Sorted tuple is simpler to code.',
      complexity:'Time: O(n·k log k) | Space: O(n·k)'
    },
    {
      type:'HASHTABLE', diff:'killer',
      text:'Longest consecutive sequence in [100,4,200,1,3,2]. Answer and complexity?',
      options:['4, O(n log n)','4, O(n)','3, O(n)','5, O(n)'],
      answer:1,
      explain:'Set all nums. For each n, only start counting if n-1 NOT in set. Count n+1, n+2... Sequence at 1: 1,2,3,4 → length 4. Each element counted at most twice → O(n).',
      complexity:'Time: O(n) | Space: O(n)'
    },

    // ── HEAP ──
    {
      type:'HEAP', diff:'medium',
      text:'What does heapq.nlargest(3, [5,1,8,2,9,3,7]) return?',
      options:['[9,8,7]','[7,8,9]','[9,7,8]','[5,8,9]'],
      answer:0,
      explain:'Returns n largest in descending order. Top 3: [9,8,7]. heapq is a min-heap — nlargest uses min-heap of size k internally: O(n log k) vs O(n log n) for full sort.',
      complexity:'Time: O(n log k) | Space: O(k)'
    },
    {
      type:'HEAP', diff:'hard',
      text:'Kth largest in stream. Which gives O(log k) per insertion?',
      options:['Sorted array','Max-heap of size n','Min-heap of size k','BST of all elements'],
      answer:2,
      explain:'Min-heap of size k: heap top is always kth largest. New element: if size<k or element>heap[0], push. If size>k, pop minimum. Heap top = kth largest. Each op O(log k).',
      complexity:'Time: O(log k) per element | Space: O(k)'
    },
    {
      type:'HEAP', diff:'killer',
      text:'Merge k sorted lists of total n elements. Optimal complexity?',
      options:['O(n·k)','O(n log k)','O(n log n)','O(k²)'],
      answer:1,
      explain:'Min-heap of size k: store (value, list_idx, elem_idx). Pop minimum O(log k), push next from same list O(log k). n extractions → O(n log k). Naive merge-two-at-a-time: O(n·k).',
      complexity:'Time: O(n log k) | Space: O(k)'
    },
    {
      type:'HEAP', diff:'killer',
      text:'Find median from data stream. Correct two-heap setup?',
      options:['Two min-heaps','Max-heap for lower half, min-heap for upper half','Two max-heaps','One sorted heap'],
      answer:1,
      explain:'Max-heap = lower half (top = max of lower). Min-heap = upper half (top = min of upper). Keep sizes equal or max-heap 1 extra. Median = max-heap top (odd) or average of tops (even). Add: O(log n). Median: O(1).',
      complexity:'Time: O(log n) add | O(1) median'
    },

    // ── GRAPH ──
    {
      type:'GRAPH', diff:'medium',
      text:'Time complexity of BFS/DFS on graph with V vertices and E edges?',
      options:['O(V²)','O(V + E)','O(E log V)','O(V × E)'],
      answer:1,
      explain:'Each vertex visited once O(V), each edge traversed once O(E) → O(V+E). Dense graph E≈V²: O(V²). Sparse E≈V: O(V). Always state both V and E.',
      complexity:'Time: O(V+E) | Space: O(V)'
    },
    {
      type:'GRAPH', diff:'hard',
      text:'Number of islands. Grid below has how many?',
      context:`1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1`,
      options:['1','2','3','4'],
      answer:2,
      explain:'DFS from each unvisited 1, mark visited (set to 0). Island1: top-left 4 cells. Island2: center. Island3: bottom-right 2 cells. Count = 3.',
      complexity:'Time: O(m×n) | Space: O(m×n)'
    },
    {
      type:'GRAPH', diff:'hard',
      text:'Detect cycle in directed graph. Which algorithm is correct?',
      options:['BFS with visited set','DFS with visited + recursion stack','Union-Find','Topological sort only'],
      answer:1,
      explain:'Maintain visited (ever seen) and rec_stack (current DFS path). If you reach a node in rec_stack → cycle. Union-Find works for undirected. Kahn\'s topological sort also detects cycles: if not all nodes processed, cycle exists.',
      complexity:'Time: O(V+E) | Space: O(V)'
    },
    {
      type:'GRAPH', diff:'killer',
      text:'Shortest path in weighted graph, no negative edges. Which algorithm?',
      options:['BFS','DFS','Dijkstra\'s','Bellman-Ford'],
      answer:2,
      explain:'Dijkstra\'s: min-heap + greedy relaxation. O((V+E) log V). BFS only for unweighted (weight=1). Bellman-Ford handles negative edges O(V×E). For negative cycles: check if Vth pass still relaxes.',
      complexity:'Dijkstra: O((V+E) log V) | BF: O(VE)'
    },
    {
      type:'GRAPH', diff:'killer',
      text:'Course schedule (detect if you can finish all courses). Reduces to?',
      options:['Shortest path','Cycle detection in directed graph','Minimum spanning tree','Matrix multiply'],
      answer:1,
      explain:'Courses = nodes, prerequisites = directed edges. Cycle = circular dependency = impossible. Use DFS cycle detection or Kahn\'s (BFS-based) topological sort. If topological order has all V nodes → no cycle → can finish.',
      complexity:'Time: O(V+E) | Space: O(V+E)'
    },

    // ── BFS ──
    {
      type:'BFS', diff:'medium',
      text:'What does BFS guarantee to find first in an unweighted graph?',
      options:['DFS path','Shortest path by edge count','Longest path','All paths'],
      answer:1,
      explain:'BFS explores level by level — first all distance-1 nodes, then distance-2, etc. First time target is reached = shortest path by edges. Does NOT hold for weighted graphs — use Dijkstra\'s.',
      complexity:'Time: O(V+E) | Space: O(V)'
    },
    {
      type:'BFS', diff:'hard',
      text:'Word ladder "hit"→"cog" (one letter at a time). BFS finds?',
      options:['Any transformation','Minimum transformations','All paths','Alphabetical first'],
      answer:1,
      explain:'Words = nodes, edges between 1-letter-apart words. BFS → shortest path = minimum transformations. hit→hot→dot→dog→cog = 5 steps. Generate all 1-letter variants, check against word set. O(n×L²).',
      complexity:'Time: O(n×L²) | Space: O(n)'
    },
    {
      type:'BFS', diff:'killer',
      text:'Graph with edges weighted 0 or 1. Fastest shortest path algorithm?',
      options:['Standard BFS','Dijkstra\'s','0-1 BFS with deque','Bellman-Ford'],
      answer:2,
      explain:'0-1 BFS: deque, push front for weight-0 edges, push back for weight-1. Maintains BFS distance invariant. O(V+E) vs Dijkstra O((V+E)log V). Classic for grid problems with free moves in one direction.',
      complexity:'Time: O(V+E) | Space: O(V)'
    },

    // ── DFS ──
    {
      type:'DFS', diff:'medium',
      text:'DFS on a graph can solve which problem?',
      options:['Shortest path in weighted graph','Topological sort of DAG','Minimum spanning tree','All pairs shortest path'],
      answer:1,
      explain:'DFS topological sort: push to stack after all neighbors visited, reverse = topological order. Also: cycle detection, connected components, SCC (Tarjan\'s/Kosaraju\'s). NOT shortest paths in weighted graphs.',
      complexity:'Time: O(V+E) | Space: O(V)'
    },
    {
      type:'DFS', diff:'hard',
      text:'All paths from source to target in DAG. Approach to enumerate them?',
      options:['Memoize with hashmap','DFS with backtracking — no memoization for enumeration','BFS level order','Topological sort first'],
      answer:1,
      explain:'For ALL paths, memoization doesn\'t help (each path unique). DFS + backtracking: add node to path, recurse, remove on return. Exponentially many paths possible — no polynomial algorithm. Memoization helps for counting or existence, not enumeration.',
      complexity:'Time: O(2^n) worst | Space: O(n)'
    },
    {
      type:'DFS', diff:'killer',
      text:'Tarjan\'s algorithm finds what in O(V+E)?',
      options:['Shortest paths','Strongly Connected Components (SCCs)','Minimum spanning tree','Bridges only'],
      answer:1,
      explain:'DFS + stack + disc[] + low[]. When low[u]==disc[u], u is SCC root — pop stack to get SCC. Single DFS pass → O(V+E). Kosaraju\'s also finds SCCs but uses two DFS passes.',
      complexity:'Time: O(V+E) | Space: O(V)'
    },

    // ── DP ──
    {
      type:'DP', diff:'hard',
      text:'Longest Common Subsequence of "abcde" and "ace". Answer?',
      options:['2','3','4','5'],
      answer:1,
      explain:'LCS = 3 → "ace". dp[i][j] = LCS of first i chars s1 and first j chars s2. If equal: dp[i][j]=dp[i-1][j-1]+1. Else: max(dp[i-1][j],dp[i][j-1]). O(m×n) time.',
      complexity:'Time: O(m×n) | Space: O(m×n)'
    },
    {
      type:'DP', diff:'killer',
      text:'0/1 Knapsack capacity=6, items=[(2,6),(2,10),(3,12)]. Max value?',
      options:['16','22','18','28'],
      answer:1,
      explain:'Items 2+3: weight=2+3=5≤6, value=10+12=22. All three: weight=7>6. Items 1+2: weight=4, value=16. Items 1+3: weight=5, value=18. Max=22.',
      complexity:'Time: O(n×W) | Space: O(W)'
    },
    {
      type:'DP', diff:'killer',
      text:'Edit distance "horse"→"ros". Minimum operations?',
      options:['2','3','4','5'],
      answer:1,
      explain:'horse→rorse(replace h→r)→rose(delete r)→ros(delete e) = 3. dp[i][j] = edit dist of s1[:i] and s2[:j]. Base: dp[i][0]=i, dp[0][j]=j.',
      complexity:'Time: O(m×n) | Space: O(m×n)'
    },

    // ── SORTING ──
    {
      type:'SORTING', diff:'hard',
      text:'QuickSort worst case occurs when, and what is that complexity?',
      options:['Random array — O(n log n)','Sorted/reverse sorted with naive pivot — O(n²)','All equal elements — O(n)','Nearly sorted — O(n log n)'],
      answer:1,
      explain:'Pivot always selects min or max → partitions of 0 and n-1 → n recursive calls → O(n²). Fix: random pivot or median-of-three. Python/C++ use introsort which switches to heapsort to guarantee O(n log n).',
      complexity:'Avg O(n log n) | Worst O(n²)'
    },
    {
      type:'SORTING', diff:'medium',
      text:'Which sort is stable and uses O(1) extra space?',
      options:['Merge sort','Heap sort','Insertion sort','Quick sort'],
      answer:2,
      explain:'Insertion sort: stable (equal elements keep relative order) and O(1) extra space. O(n²) time. Best for nearly sorted data (O(n)). Merge sort stable but O(n) space. Heap sort O(1) space but NOT stable.',
      complexity:'Time: O(n²) avg | O(n) best | Space: O(1)'
    },

    // ── TWO POINTER ──
    {
      type:'TWO POINTER', diff:'medium',
      text:'Container with most water [1,8,6,2,5,4,8,3,7]. Max area?',
      options:['48','49','56','42'],
      answer:1,
      explain:'Two pointers at ends. Area = min(h[l],h[r])×(r-l). Move shorter pointer inward. Best: l=1(h=8), r=7(h=7) → min(8,7)×7=49.',
      complexity:'Time: O(n) | Space: O(1)'
    },
    {
      type:'SLIDING WINDOW', diff:'hard',
      text:'Min window substring: S="ADOBECODEBANC", T="ABC". Minimum window?',
      options:['"BANC"','"ADOBEC"','"CODEBA"','"ABC"'],
      answer:0,
      explain:'Sliding window: expand right until all chars covered, shrink left to minimize. "BANC" (length 4) is minimum containing A,B,C. Each char added/removed at most once → O(n).',
      complexity:'Time: O(n+m) | Space: O(m)'
    },

    // ── BINARY SEARCH ──
    {
      type:'BINARY SEARCH', diff:'hard',
      text:'Search [4,5,6,7,0,1,2] for target=0. Which index?',
      options:['4','5','6','Error'],
      answer:0,
      explain:'Rotated binary search: check which half is sorted. mid=7, left sorted [4,5,6,7], 0 not in range → search right. mid=1, right sorted [0,1,2], 0 in range → search left. Found at index 4.',
      complexity:'Time: O(log n) | Space: O(1)'
    },
    {
      type:'BINARY SEARCH', diff:'killer',
      text:'Find minimum in rotated sorted array [3,4,5,1,2]. Key condition?',
      options:['nums[mid] > nums[right] → min in right half','nums[mid] < nums[right] → min in left half including mid','Compare with left always','Linear scan'],
      answer:0,
      explain:'Compare mid with right. If nums[mid]>nums[right]: rotation point in right → lo=mid+1. If nums[mid]<=nums[right]: min in left including mid → hi=mid. [3,4,5,1,2]: mid=5>right=2 → go right. mid=1≤2 → go left. min=1.',
      complexity:'Time: O(log n) | Space: O(1)'
    },
  ]
},

// ════════════════════════════════════════════
// 2. LOGIC
// ════════════════════════════════════════════
{
  id:'logic', name:'Logic', icon:'🧩', color:'#a855f7',
  desc:'Puzzles, reasoning, probability, brain teasers',
  questions:[
    {
      type:'LOGIC PUZZLE', diff:'medium',
      text:'8 balls, one heavier. Balance scale minimum weighings?',
      options:['1','2','3','4'],
      answer:1,
      explain:'Groups of 3,3,2. Weigh the two 3s. If balanced: heavier is in group of 2 → 1 more weighing. If unbalanced: weigh 2 of the heavier 3 → if balanced it\'s the third. Always 2 weighings.',
      complexity:'Information theory: ⌈log₃(8)⌉ = 2'
    },
    {
      type:'PROBABILITY', diff:'hard',
      text:'Monty Hall: you pick door 1, host opens door 3 (goat). Switch?',
      options:['No, 50/50','Yes, switching wins 2/3','No, staying wins 2/3','Doesn\'t matter'],
      answer:1,
      explain:'Initially 1/3 chance correct. Host always opens a losing door. If wrong (2/3 chance), remaining door must be right. P(win|switch)=2/3. P(win|stay)=1/3. Mathematically proven — run simulations to convince yourself.',
      complexity:'P(win|switch) = 2/3'
    },
    {
      type:'LOGIC', diff:'hard',
      text:'All Bloops are Razzles. All Razzles are Lazzles. Are all Bloops Lazzles?',
      options:['Yes','No','Cannot determine','Only sometimes'],
      answer:0,
      explain:'Transitive: Bloop⊆Razzle and Razzle⊆Lazzle → Bloop⊆Lazzle. Yes, all Bloops are Lazzles. Converse (all Lazzles are Bloops) need not be true.',
      complexity:'Transitive closure of subset relations'
    },
    {
      type:'PROBABILITY', diff:'killer',
      text:'Birthday paradox: people needed for >50% chance two share a birthday?',
      options:['183','23','50','100'],
      answer:1,
      explain:'P(no match with n people) = 365/365 × 364/365 × ... At n=23 this drops below 0.5. 23 people create 23×22/2=253 pairs — many chances for a match. Counterintuitive because we compare pairs not individuals.',
      complexity:'P(match) > 0.5 at n=23'
    },
    {
      type:'LOGIC PUZZLE', diff:'killer',
      text:'3 switches, 1 light in another room. Enter only once. How to identify?',
      options:['Random guess','Turn on switch 1 for 10min, turn off, turn on switch 2, enter','Can\'t be done','Need two visits'],
      answer:1,
      explain:'Use heat: switch 1 on for 10min (off), switch 2 on, enter. Light on→switch 2. Off+warm→switch 1. Off+cold→switch 3. Exploits a physical property (heat) to encode a third state beyond on/off.',
      complexity:'Information encoding beyond binary'
    },
    {
      type:'LOGIC', diff:'hard',
      text:'Two guards: one always lies, one always tells truth. Two doors: freedom or death. One question. What do you ask?',
      options:['"Which door is freedom?"','"What would the OTHER guard say leads to freedom?" Then pick opposite','Ask both','Ask which guard lies'],
      answer:1,
      explain:'"What would the other guard say?" Both converge on the wrong answer (liar lies about truth-teller\'s answer; truth-teller truthfully reports liar\'s false answer). Pick the OTHER door. Works regardless of which guard you ask.',
      complexity:'Self-referential logic eliminates uncertainty'
    },
    {
      type:'PROBABILITY', diff:'hard',
      text:'Roll die. Even: win that amount. Odd: lose $1. Expected value?',
      options:['$1.00','$0.50','$1.50','$0.00'],
      answer:2,
      explain:'Odd faces 1,3,5: -$1 each → -3. Even faces 2,4,6: +$2,+$4,+$6 → +12. Net=9 over 6 outcomes. E=9/6=$1.50.',
      complexity:'E[X] = Σ p(x)·x'
    },
    {
      type:'LOGIC', diff:'killer',
      text:'100 prisoners, numbers 1-100 in boxes, each opens 50. Strategy for ALL to succeed?',
      options:['Random selection','Each opens their number, follows chain of values','Split boxes in half','Coordinate before entering'],
      answer:1,
      explain:'Loop strategy: prisoner n opens box n, then the number inside, following the chain. Succeeds if their cycle length ≤50. P(longest cycle ≤50) ≈ 69%. Random: (1/2)^100 ≈ 0%. Remarkable result from permutation cycle theory.',
      complexity:'P(success) ≈ 69% vs ~0% random'
    },
    {
      type:'LOGIC', diff:'medium',
      text:'Farmer has 17 sheep. All but 9 die. How many left?',
      options:['8','9','0','17'],
      answer:1,
      explain:'"All but 9" = all except 9. "All but 9 die" = 9 survive. Classic misdirection — "all but" is misread as "almost all." Answer: 9.',
      complexity:'Language precision'
    },
    {
      type:'LOGIC', diff:'hard',
      text:'If it rains the match is cancelled. Match was NOT cancelled. Conclude?',
      options:['It rained','It did not rain','The match was played','Cannot determine'],
      answer:1,
      explain:'Modus Tollens: P→Q, ¬Q → ¬P. Rain→Cancelled, Not Cancelled → Not Rain. It did not rain. Note: not cancelled doesn\'t prove match WAS played (other reasons possible), but definitively proves no rain.',
      complexity:'Modus Tollens: P→Q, ¬Q ⊢ ¬P'
    },
    {
      type:'PROBABILITY', diff:'killer',
      text:'St. Petersburg Paradox: flip until tails, win 2^n. How much to pay?',
      options:['$10','$100','Infinite EV but rational players pay ~$20-30','$50'],
      answer:2,
      explain:'E = Σ(1/2^n)(2^n) = Σ1 = ∞. Infinite expected value, but people pay ~$20-30. Explains why EV alone doesn\'t capture decisions — utility is logarithmic (diminishing returns). Motivated utility theory and risk aversion.',
      complexity:'E[X] = ∞ but utility is finite'
    },
    {
      type:'LOGIC PUZZLE', diff:'killer',
      text:'Einstein\'s Riddle: 5 houses, 5 nationalities. Who owns the fish?',
      options:['The German','The Norwegian','The Swede','The Dane'],
      answer:0,
      explain:'Through systematic elimination of 15 clues, the German owns the fish (house 4, smokes Prince, drinks coffee). Requires constraint propagation — same technique used in SAT solvers and Sudoku. ~2% solve without aids.',
      complexity:'15-constraint satisfaction problem'
    },
  ]
},

// ════════════════════════════════════════════
// 3. ML & AI
// ════════════════════════════════════════════
{
  id:'ml', name:'ML & AI', icon:'🤖', color:'#22c55e',
  desc:'Machine learning, neural nets, math behind AI',
  questions:[
    {
      type:'FUNDAMENTALS', diff:'medium',
      text:'High bias model is characterized by?',
      options:['Overfitting, low training error','Underfitting, high training AND test error','Low training error, high test error','Perfect fit on training data'],
      answer:1,
      explain:'High bias = underfitting. Too simple to capture patterns → both training and test error are high. High variance = overfitting → low training error, high test error. Regularization reduces variance; more features/complexity reduce bias.',
      complexity:'Total Error = Bias² + Variance + Noise'
    },
    {
      type:'NEURAL NETS', diff:'hard',
      text:'Softmax output for logits [2, 1, 0]?',
      options:['[0.67, 0.24, 0.09]','[0.50, 0.25, 0.25]','[1.0, 0.0, 0.0]','[0.33, 0.33, 0.33]'],
      answer:0,
      explain:'exp(2)≈7.39, exp(1)≈2.72, exp(0)=1. Sum≈11.11. Probs≈[0.665, 0.245, 0.090]. All positive, sum to 1. Numerically stable: subtract max logit before exponentiation.',
      complexity:'Time: O(n) | Output sums to 1'
    },
    {
      type:'NEURAL NETS', diff:'hard',
      text:'Vanishing gradient: cause and main fix?',
      options:['Learning rate too high','Gradients shrink exponentially through deep layers — fix: ReLU/ResNets','Too much data','Batch size too large'],
      answer:1,
      explain:'Sigmoid/tanh saturate — gradient ≈ 0 at extremes. Deep backprop multiplies tiny gradients → exponentially small at early layers. Fixes: ReLU (gradient=1 for positive), ResNets (skip connections), batch norm, He/Xavier init.',
      complexity:'Gradient magnitude: O(σ′ⁿ) where σ′<1'
    },
    {
      type:'ML MATH', diff:'killer',
      text:'θ = θ - α∇L. If loss increases after update, what happened?',
      options:['α too small','α too large — overshot minimum','Wrong optimizer','Batch size issue'],
      answer:1,
      explain:'Large α: update overshoots minimum → loss increases. Reduce α. Adaptive optimizers (Adam, RMSProp) auto-adjust per-parameter rates. Warmup+decay schedules are standard in deep learning.',
      complexity:'Convergence requires α < 2/L (Lipschitz constant)'
    },
    {
      type:'ML CONCEPTS', diff:'medium',
      text:'When is high precision more important than recall?',
      options:['Cancer screening','Spam filtering','Earthquake detection','Email fraud where blocking valid users is worse'],
      answer:3,
      explain:'High precision = few false positives. Critical when FP cost is high: spam (don\'t block real emails), legal retrieval. High recall = few false negatives. Critical when FN cost high: cancer screening, fraud detection. F1 = 2PR/(P+R) balances both.',
      complexity:'F1 = 2×P×R/(P+R)'
    },
    {
      type:'NEURAL NETS', diff:'killer',
      text:'Self-attention complexity in Transformers?',
      options:['O(n)','O(n log n)','O(n²)','O(n²d) where d=embedding dim'],
      answer:3,
      explain:'QK^T is n×n (O(n²d)). Softmax O(n²). Multiply by V: O(n²d). Total O(n²d). Why Transformers struggle with long sequences. Sparse/linear attention reduces to O(n log n) or O(n).',
      complexity:'Time: O(n²d) | Space: O(n²)'
    },
    {
      type:'ML CONCEPTS', diff:'hard',
      text:'L1 vs L2 regularization: which produces sparse weights and why?',
      options:['L2 (ridge) — penalizes large weights more','L1 (lasso) — constant gradient pushes weights to exactly 0','Both equally','Neither'],
      answer:1,
      explain:'L1 gradient = ±λ (constant regardless of weight size) → weights can reach exactly 0 → sparsity → feature selection. L2 gradient = 2λw → shrinks toward but rarely reaches 0. Elastic Net combines both.',
      complexity:'L1: sparse | L2: small but nonzero'
    },
    {
      type:'ML MATH', diff:'killer',
      text:'Backprop through sigmoid: if σ(x)=0.8, what is σ\'(x)?',
      options:['0.8','0.16','0.2','0.64'],
      answer:1,
      explain:'σ\'(x) = σ(x)(1−σ(x)) = 0.8×0.2 = 0.16. At σ=0.99: σ\'=0.0099 — vanishing gradient. ReLU: gradient exactly 1 for positive inputs — no saturation.',
      complexity:'σ\'(x) = σ(x)(1-σ(x))'
    },
    {
      type:'ML CONCEPTS', diff:'hard',
      text:'Curse of dimensionality: what happens in high dimensions?',
      options:['More features always help','Data becomes exponentially sparse — distances lose meaning','GPU memory runs out','Overfitting in low dimensions'],
      answer:1,
      explain:'Volume grows exponentially. Points become equidistant — KNN fails. Need exponentially more data for density. PCA/t-SNE/autoencoders reduce dimensionality. Most volume of high-d hypersphere is near the surface, not center.',
      complexity:'Data needed: O(ε^-d) for ε-covering'
    },
    {
      type:'NEURAL NETS', diff:'killer',
      text:'Batch Normalization: what does it normalize and what problem does it solve?',
      options:['Normalizes inputs to [0,1]','Normalizes activations per batch to μ=0,σ=1 — fixes internal covariate shift','Normalizes weights only','Normalizes gradients'],
      answer:1,
      explain:'BatchNorm: normalize activations within mini-batch, then apply learnable γ (scale) and β (shift). Fixes internal covariate shift (distribution of inputs to each layer shifts during training). Enables higher learning rates, acts as regularizer. At inference uses running statistics.',
      complexity:'Adds 2 learnable params per feature'
    },
    {
      type:'ML CONCEPTS', diff:'medium',
      text:'K-Fold CV k=5 on 1000 samples. How many times is each sample used for testing?',
      options:['5','1','4','2'],
      answer:1,
      explain:'Each sample appears in exactly ONE test fold → tested once. Training k-1 times. Gives better generalization estimate than single split. k=5 or k=10 standard; k=n is leave-one-out CV.',
      complexity:'Trains k models | Tests each sample once'
    },
    {
      type:'ML MATH', diff:'killer',
      text:'VC dimension of a linear classifier in d dimensions?',
      options:['d','d+1','2d','∞'],
      answer:1,
      explain:'VC dim = d+1. Can shatter any d+1 points in general position, but no d+2 points. Measures model complexity. PAC learning bound: error ≤ O(√(VC_dim/n)).',
      complexity:'VC dim = d+1 for linear classifiers'
    },
  ]
},

// ════════════════════════════════════════════
// 4. DB & SYSTEMS
// ════════════════════════════════════════════
{
  id:'db', name:'DB & Systems', icon:'🗄️', color:'#f59e0b',
  desc:'Databases, OS, distributed systems, indexing',
  questions:[
    {
      type:'INDEXING', diff:'hard',
      text:'50M rows. WHERE status=\'pending\' AND created_at > \'2025-01-01\'. Best index?',
      options:['Single on status','Single on created_at','Composite (status, created_at)','No index needed'],
      answer:2,
      explain:'Composite (status, created_at): equality first (status filters most rows), then range (created_at). B-tree seeks to status=\'pending\' then scans date range. Rule: equality cols first, range cols last.',
      complexity:'Seek O(log n) + scan O(k)'
    },
    {
      type:'TRANSACTIONS', diff:'hard',
      text:'ACID: which property prevents concurrent transactions seeing partial results?',
      options:['Atomicity','Consistency','Isolation','Durability'],
      answer:2,
      explain:'Isolation: transactions appear to execute serially. Without it: dirty reads, non-repeatable reads, phantom reads. Levels: READ UNCOMMITTED→READ COMMITTED→REPEATABLE READ→SERIALIZABLE (more isolation, less performance).',
      complexity:'Serializability is strongest isolation'
    },
    {
      type:'DB INTERNALS', diff:'killer',
      text:'Why do databases prefer B+ trees over B-trees?',
      options:['Faster point queries','Data only in leaves + linked leaves enable fast range scans','Less memory','Lower height'],
      answer:1,
      explain:'B+ tree: internal nodes store only keys (more keys per node, shorter tree). All data in leaves. Leaves linked as doubly-linked list → fast sequential range scans. Critical for ORDER BY, range queries. B-tree data in all nodes → range scans require backtracking.',
      complexity:'Height: O(log_B n) where B=branching factor'
    },
    {
      type:'DISTRIBUTED', diff:'killer',
      text:'CAP theorem: during network partition, what must you sacrifice?',
      options:['Availability','Consistency','Partition tolerance — but P is mandatory','Either C or A — P is non-negotiable'],
      answer:3,
      explain:'Partitions WILL happen — can\'t avoid them. Real choice: CP (reject requests to stay consistent — HBase, Zookeeper) or AP (serve stale data — Cassandra, DynamoDB). CA only possible on single node.',
      complexity:'CAP: choose 2, but P is mandatory'
    },
    {
      type:'INDEXING', diff:'hard',
      text:'What is a covering index and when does it eliminate table lookups?',
      options:['Index on every column','Index containing all columns needed by a query — no heap fetch needed','Primary key index','Full-text index'],
      answer:1,
      explain:'Covering index: all SELECT+WHERE+ORDER BY columns in the index. Engine reads only the index, never touches main table. EXPLAIN shows "Using index." Trade-off: larger index → more write overhead.',
      complexity:'Eliminates O(k) heap fetches'
    },
    {
      type:'DB CONCEPTS', diff:'medium',
      text:'Database sharding solves what and introduces what?',
      options:['Solves slow queries, introduces duplicates','Solves storage/throughput limits via horizontal partitioning, introduces cross-shard query complexity','Solves write conflicts, introduces read latency','Solves indexing, introduces network overhead'],
      answer:1,
      explain:'Sharding: split data across nodes by shard key. Solves: single-node storage limits, write throughput. Introduces: cross-shard joins (expensive), hot shards, rebalancing complexity, distributed transactions. Choose shard key carefully.',
      complexity:'Cross-shard queries: O(shards) network calls'
    },
    {
      type:'OS CONCEPTS', diff:'hard',
      text:'Difference between a process and a thread?',
      options:['No difference','Process: isolated memory; Thread: shares memory within process, lighter','Thread has own memory; Process shares','Process is faster'],
      answer:1,
      explain:'Process: own address space, file descriptors, heap — isolated. Thread: shares heap/globals, own stack and registers. Process switch expensive (TLB flush). Thread switch cheaper. Python GIL prevents parallel CPU threads — use multiprocessing for CPU-bound.',
      complexity:'Thread switch ~1μs | Process switch ~10μs'
    },
    {
      type:'DB CONCEPTS', diff:'killer',
      text:'MVCC achieves what?',
      options:['Faster writes by skipping locks','Readers never block writers and writers never block readers via multiple row versions','Automatic sharding','Better compression'],
      answer:1,
      explain:'Each write creates new row version with timestamp. Readers see consistent snapshot at transaction start — no read locks. Writers create new versions without blocking readers. GC eventually removes old versions. Used in PostgreSQL, Oracle, MySQL InnoDB.',
      complexity:'Readers: O(1) no lock | Writers: O(1) new version'
    },
    {
      type:'DISTRIBUTED', diff:'killer',
      text:'Consistent hashing: what problem does it solve when adding/removing nodes?',
      options:['Eliminates hotspots','Only O(n/k) keys remap when adding a node vs O(n) for modular hashing','Improves query speed','Enables cross-shard joins'],
      answer:1,
      explain:'Modular hashing: adding 1 node remaps almost all keys. Consistent hashing: nodes on a ring, adding a node only remaps keys from new node to its predecessor → O(n/k). Used in DynamoDB, Cassandra, Memcached.',
      complexity:'Remap O(n/k) vs O(n) for modular'
    },
    {
      type:'DB CONCEPTS', diff:'hard',
      text:'N+1 query problem: what is it and how to fix?',
      options:['Joining N tables','1 query for parents then N queries for each child — fix with JOIN or eager loading','Using N indexes','N concurrent connections'],
      answer:1,
      explain:'N+1: fetch 100 users (1 query), then 100 queries for each user\'s posts = 101 queries. Fix: JOIN (1 query) or ORM eager loading (SELECT IN, 2 queries). Silent killer — use query logging to detect.',
      complexity:'N+1: O(n) queries | JOIN: O(1) queries'
    },
    {
      type:'OS CONCEPTS', diff:'killer',
      text:'What happens during a page fault?',
      options:['Program crashes','OS pauses process, loads page from disk to RAM, resumes — transparent to program','RAM becomes full','CPU resets'],
      answer:1,
      explain:'Virtual memory: if page not in RAM, hardware raises fault. OS finds page on disk (swap), allocates RAM frame, updates page table, resumes. ~1ms (disk) vs ~100ns (RAM) = 10,000× slower. Excessive faults = thrashing.',
      complexity:'Page fault cost: ~1ms disk access'
    },
    {
      type:'DISTRIBUTED', diff:'hard',
      text:'Eventual consistency in DynamoDB/Cassandra means?',
      options:['Data is never consistent','After writes stop, all replicas converge — reads may see stale data temporarily','Consistency enforced immediately','Only one replica ever'],
      answer:1,
      explain:'Writes propagate asynchronously. Different replicas may return different values during propagation. After writes stop, all converge. DynamoDB: strongly consistent reads (higher cost) or eventually consistent (default, ~1s stale). Trade consistency for availability/performance.',
      complexity:'Convergence time depends on replication lag'
    },
  ]
},

// ════════════════════════════════════════════
// 5. NEGOTIATION
// ════════════════════════════════════════════
{
  id:'negotiation', name:'Negotiation', icon:'🤝', color:'#f43f5e',
  desc:'Salary, deals, influence, high-stakes communication',
  questions:[
    {
      type:'SALARY NEG', diff:'medium',
      text:'Recruiter asks your expected salary first. Best response?',
      options:['Give exact number immediately','"I\'d like to understand the full scope — what\'s the budgeted range?"','Say "I\'ll take whatever is fair"','Refuse to answer'],
      answer:1,
      explain:'First number anchors the negotiation. Deflecting forces them to reveal the range — information advantage. If pressed: "What is the role budgeted for?" Anchoring too low is a costly mistake.',
      complexity:'Anchoring effect: first number dominates'
    },
    {
      type:'TACTICS', diff:'hard',
      text:'BATNA stands for what and why is it most important?',
      options:['Best Alternative To a Negotiated Agreement — defines walk-away point and leverage','Best Approach To Negotiating Agreements','Baseline Agreement Terms for Negotiating Actors','None'],
      answer:0,
      explain:'BATNA = your best option if negotiation fails. Strong BATNA = strong leverage. Improve BATNA before negotiating (get competing offers). Never reveal a weak BATNA. Party with stronger BATNA has more power.',
      complexity:'Power = f(BATNA strength)'
    },
    {
      type:'SALARY NEG', diff:'hard',
      text:'Offer: $120k. You want $140k. Best approach?',
      options:['"I can\'t accept this"','Express enthusiasm then counter at $145k with justification','Accept immediately','Counter at $200k'],
      answer:1,
      explain:'Script: (1) express genuine enthusiasm, (2) counter slightly above target ($145k to land at $140k), (3) justify with data. Silence after stating your number is powerful — don\'t fill it.',
      complexity:'Anchor above target to account for concession'
    },
    {
      type:'TACTICS', diff:'killer',
      text:'"Good Cop, Bad Cop" is being used on you. How to neutralize?',
      options:['Negotiate with good cop only','Name the tactic: "It seems you have different constraints — can we discuss what\'s actually possible?"','Walk away immediately','Focus only on bad cop'],
      answer:1,
      explain:'Naming the tactic neutralizes it — both parties know the game is visible. Good/Bad Cop only works when target believes good cop is genuinely on their side. Transparency collapses the dynamic.',
      complexity:'Meta-awareness disrupts psychological tactics'
    },
    {
      type:'TACTICS', diff:'hard',
      text:'"This offer expires tomorrow." What is usually true about exploding offers?',
      options:['Always real — act fast','Usually artificial — call the bluff professionally','Always accept immediately','Never engage'],
      answer:1,
      explain:'Artificial urgency = scarcity tactic. Response: "I need until [date] to make a fully informed decision." Most companies extend for the right candidate. If they don\'t, that signals bad culture.',
      complexity:'Artificial scarcity → manufactured pressure'
    },
    {
      type:'SALARY NEG', diff:'killer',
      text:'3 competing offers. How to maximize all three?',
      options:['Take highest immediately','Use each as leverage: "I have competing offers — what\'s your best number?"','Keep all secret','Only negotiate with preferred company'],
      answer:1,
      explain:'Competing offers are leverage. Transparently disclose offers exist (don\'t reveal specific numbers first). Ask each for best number. Use highest offer to negotiate others upward. Be honest — bluffing damages trust.',
      complexity:'Auction dynamic: competition increases all offers'
    },
    {
      type:'TACTICS', diff:'medium',
      text:'Manager says "budget is frozen." Best next move?',
      options:['Accept and wait','Expand: "What would need to happen for a review? Can we discuss non-salary compensation?"','Threaten to quit','Escalate to HR'],
      answer:1,
      explain:'Budget frozen ≠ no options. Expand to: sign-on bonus, extra PTO, remote work, title change, accelerated review, equity, learning budget. Ask what conditions unlock a review — meet them. Plants the seed for when budget unfreezes.',
      complexity:'Convert constraints into conditional agreements'
    },
    {
      type:'TACTICS', diff:'killer',
      text:'Loss aversion: people feel losses ~2× more than equivalent gains. Application to negotiation?',
      options:['Irrelevant','Frame proposal as loss prevention: "You\'ll lose $50k in productivity without this"','Always talk about gains','Focus on emotions not facts'],
      answer:1,
      explain:'Kahneman: losing $100 feels as bad as gaining $200. Reframe gains as loss prevention: "Not hiring me costs $X" vs "I will generate $X." Loss framing triggers stronger emotional response.',
      complexity:'Loss aversion coefficient ≈ 2 (Kahneman)'
    },
  ]
},

// ════════════════════════════════════════════
// 6. MIND CONTROL
// ════════════════════════════════════════════
{
  id:'mind', name:'Mind Control', icon:'🧠', color:'#818cf8',
  desc:'Focus, habits, cognitive biases, mental models',
  questions:[
    {
      type:'COGNITIVE BIAS', diff:'medium',
      text:'You believe Python is best and only read Python praise. This is?',
      options:['Smart research','Confirmation bias — seeking info confirming existing beliefs','Efficient filtering','Rational decision-making'],
      answer:1,
      explain:'Confirmation bias: favor information confirming your beliefs. Antidote: steelman the best opposing argument. Scientists use pre-registration and peer review to combat it. In tech: benchmark objectively before deciding on tools.',
      complexity:'Affects all humans regardless of IQ'
    },
    {
      type:'MENTAL MODELS', diff:'hard',
      text:'First principles thinking: Musk reduced rocket cost from $65M to $6M. Key insight?',
      options:['Negotiate better contracts','Decompose rockets to raw materials cost, rebuild from scratch','Use cheaper labor','Copy from Russia'],
      answer:1,
      explain:'Strip all assumptions, identify fundamental truths. "Rockets cost $65M because that\'s what they cost." First principles: raw materials ≈ $500k. The 100× markup came from supplier chains and industry assumptions. Question every assumption until you hit physical/mathematical limits.',
      complexity:'Challenge every assumption recursively'
    },
    {
      type:'FOCUS', diff:'hard',
      text:'Parkinson\'s Law: work expands to fill available time. Productivity implication?',
      options:['More time = more quality','Artificially shorter deadlines force focus and eliminate scope creep','Never set deadlines','Work at your own pace'],
      answer:1,
      explain:'2-week task given 2 weeks will take 2 weeks (perfectionism, scope creep, procrastination). Fix: time-box aggressively. Forces prioritization of what matters. Used in sprints, Pomodoro, ship-fast culture.',
      complexity:'Effort ≈ f(time available) not f(complexity)'
    },
    {
      type:'COGNITIVE BIAS', diff:'hard',
      text:'Sunk cost fallacy: 2 years on a failing startup. Rational decision?',
      options:['Keep going — invested too much','Cut losses based on current/future value, ignoring past costs','Wait one more year','Ask others'],
      answer:1,
      explain:'Sunk cost: past investment is unrecoverable. Rational: only future costs and benefits matter. Ask: "If I started today with no history, would I choose this?" If no — stop. Brain treats past effort as ownership (endowment effect).',
      complexity:'Past costs are irrelevant to future decisions'
    },
    {
      type:'HABITS', diff:'medium',
      text:'To break a bad habit, which lever is most effective?',
      options:['Change the reward','Eliminate or change the cue','Increase willpower','Punish yourself after'],
      answer:1,
      explain:'Habits trigger automatically from cues. Removing the cue prevents the loop from starting. Phone addiction → remove phone from bedroom. Willpower depletes. Environment design: make bad habits invisible (remove cue) and good habits obvious (add cue).',
      complexity:'Behavior = f(environment) not just f(willpower)'
    },
    {
      type:'MENTAL MODELS', diff:'killer',
      text:'Dunning-Kruger: at which competence level does confidence peak incorrectly?',
      options:['Experts','Beginners with limited knowledge','Intermediate learners','It\'s a myth'],
      answer:1,
      explain:'Beginners lack metacognitive ability to recognize incompetence → overconfidence ("Mount Stupid"). More learning → realize how much you don\'t know → confidence dips ("valley of despair"). Experts have calibrated confidence. Most confident person in room is often least informed.',
      complexity:'Metacognition requires competence to assess competence'
    },
    {
      type:'FOCUS', diff:'killer',
      text:'Deep Work vs Shallow Work: key distinction?',
      options:['Work done late at night','Cognitively demanding distraction-free work that pushes your limits — vs low-cognitive-demand tasks','Working longer hours','Collaborative vs solo work'],
      answer:1,
      explain:'Deep Work: distraction-free concentration producing high-value, hard-to-replicate output (architecture, writing, research). Shallow: low-demand (email, meetings, admin). Modern environment constantly pulls toward shallow. Schedule deep work blocks like meetings.',
      complexity:'Deep work capacity is the new competitive advantage'
    },
    {
      type:'COGNITIVE BIAS', diff:'hard',
      text:'Availability heuristic: after plane crash news, you fear flying more than driving. What\'s happening?',
      options:['Rational risk assessment','Overestimating probability of vivid/recent events — flying is 95× safer per mile','Correct safety analysis','Media manipulation'],
      answer:1,
      explain:'Judge probability by how easily examples come to mind. Plane crashes: vivid, dramatic, heavily covered → feel common. Car accidents: mundane → underestimated despite being far deadlier. Fix: consult base rates, not memorable examples.',
      complexity:'Perceived probability ≠ actual probability'
    },
    {
      type:'MENTAL MODELS', diff:'killer',
      text:'Inversion (Munger): instead of "how to succeed," ask?',
      options:['"How to be average?"','"What are all the ways I could fail, and how do I avoid them?"','Both equivalent','Ask for advice instead'],
      answer:1,
      explain:'Inversion: mentally reverse your goal. "What would destroy this company?" then avoid those things. Often clearer to identify failure modes than success paths. Reveals blind spots forward thinking misses. "Avoiding stupidity > pursuing brilliance."',
      complexity:'Avoiding stupidity > pursuing brilliance'
    },
    {
      type:'FOCUS', diff:'hard',
      text:'GTD two-minute rule: when does it apply?',
      options:['Meditate 2 min daily','If task takes <2 min to complete, do it NOW instead of scheduling','Plan day in 2 min','Read email for only 2 min'],
      answer:1,
      explain:'Processing overhead (capture, organize, review, return) exceeds 2 min for most tasks. If action <2 min: just do it. Prevents small tasks clogging your system. Trap: using it to justify context-switching during deep work. Apply during processing time only.',
      complexity:'If action < 2min: do it now, else schedule'
    },
    {
      type:'COGNITIVE BIAS', diff:'killer',
      text:'Fundamental attribution error: colleague is late to meeting. Your first instinct?',
      options:['They must have traffic (situational)','They are lazy/irresponsible (dispositional) — ignoring situational factors','Both equally likely','No judgment'],
      answer:1,
      explain:'Attribute others\' behavior to character, own behavior to circumstances. They\'re late → lazy. You\'re late → traffic. Antidote: assume positive intent first, ask about circumstances before judging character.',
      complexity:'Actor-observer asymmetry in causal attribution'
    },
    {
      type:'MENTAL MODELS', diff:'hard',
      text:'Second-order thinking: you solve traffic by widening roads. Second-order effect?',
      options:['Traffic improves permanently','Induced demand — more people drive, traffic returns worse than before','Roads get damaged faster','None'],
      answer:1,
      explain:'Induced demand: more lanes → more drivers → traffic as bad or worse in 5 years. Think at least 2 steps ahead. First-order: more lanes = less congestion. Second-order: more lanes = more driving. System effects often oppose direct interventions.',
      complexity:'System effects often oppose direct interventions'
    },
  ]
}

]; // end CATEGORIES
