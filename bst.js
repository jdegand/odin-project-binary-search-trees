const merge = (left, right) => {
    const output = []
    let leftIndex = 0
    let rightIndex = 0
  
    while(leftIndex < left.length && rightIndex < right.length){
      if(left[leftIndex] < right[rightIndex]){
        output.push(left[leftIndex])
        leftIndex++
      } else {
        output.push(right[rightIndex])
        rightIndex++
      }
    }
    return [...output, ...left.slice(leftIndex), ...right.slice(rightIndex)] 
  }
  
const mergeSort = array => {
    if(array.length <= 1){
      return array
    }
    const middleIndex = Math.floor(array.length / 2)
    const leftArr = array.slice(0, middleIndex)
    const rightArr = array.slice(middleIndex)
  
    return merge(mergeSort(leftArr), mergeSort(rightArr))
}

class Node {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  
  class BinarySearchTree {
    // didn't realize the odin project directions called for the root to be the result of a buildTree function
    // Minor differences - but potential to have broken something
    /*
    constructor() {
      this.root = null;
    }
    */
    constructor(array) {
        // never unbalanced ?  the function always balances it - so need to insert after the fact to unbalance
        this.root = toBST(buildTree(array))
    }
  
    isEmpty() {
      return this.root === null;
    }

    getRoot() {
      return this.root.value;
    }

    // the root will never be null now
    insert(value) {
      const newNode = new Node(value);
      if (this.isEmpty()) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
    }
  
    insertNode(root, newNode) {
      if (newNode.value < root.value) {
        if (root.left === null) {
          root.left = newNode;
        } else {
          this.insertNode(root.left, newNode);
        }
      } else {
        if (root.right === null) {
          root.right = newNode;
        } else {
          this.insertNode(root.right, newNode);
        }
      }
    }
  
    search(root, value) {
      if (!root) {
        return false;
      }
      if (root.value === value) {
        return true;
      } else if (value < root.value) {
        return this.search(root.left, value);
      } else {
        return this.search(root.right, value);
      }
    }
  
    min(root) {
      if (!root.left) {
        return root.value;
      } else {
        return this.min(root.left);
      }
    }
  
    max(root) {
      if (!root.right) {
        return root.value;
      } else {
        return this.max(root.right);
      }
    }
  
    delete(value) {
      this.root = this.deleteNode(this.root, value);
    }
  
    deleteNode(root, value) {
      if (root === null) {
        return root;
      }
      if (value < root.value) {
        root.left = this.deleteNode(root.left, value);
      } else if (value > root.value) {
        root.right = this.deleteNode(root.right, value);
      } else {
        if (!root.left && !root.right) {
          return null;
        }
        if (!root.left) {
          return root.right;
        } else if (!root.right) {
          return root.left;
        }
        root.value = this.min(root.right);
        root.right = this.deleteNode(root.right, root.value);
      }
      return root;
    }
  
    // left, root, right
    inOrder() {
      let result = []
      const traverse = (node) => {
        if (node) {
          if (node.left) {
            traverse(node.left)
          }
          result.push(node.value)
          if (node.right) {
            traverse(node.right)
          }
        }
      }
      traverse(this.root)
      return result
    }

    //root, left, right
    preOrder() {
      let result = []
      const traverse = (node) => {
        if (node) {
          result.push(node.value)
          if (node.left) {
            traverse(node.left)
          }
          if (node.right) {
            traverse(node.right)
          }
        }
      }
      traverse(this.root)
      return result
    }
  
    // left, right, root
    postOrder() {
      let result = []
      const traverse = (node) => {
        if (node) {
          if (node.left) {
            traverse(node.left)
          }
          if (node.right) {
            traverse(node.right)
          }
        }
        result.push(node.value)
      }
      traverse(this.root)
      return result
    }
  
    // bfs
    levelOrder() {
      /* Use an optimised queue  */
      const queue = [];
      const output = [];
      queue.push(this.root);
      while (queue.length) {
        let curr = queue.shift();
        output.push(curr.value);
        if (curr.left) {
          queue.push(curr.left);
        }
        if (curr.right) {
          queue.push(curr.right);
        }
      }
      return output
    }
  
    height(node) {
      if (!node) {
        return -1;
      } else {
        const leftHeight = this.height(node.left) + 1;
        const rightHeight = this.height(node.right) + 1;
        return Math.max(leftHeight, rightHeight);
      }
    }

    find(value) {
      let current = this.root;
      while (current.value !== value) {
        if (value < current.value) {
          current = current.left;
        }
        else {
          current = current.right;
        }
        if (current === null) {
          return null;
        }
      }
      return current
    }
  
    // doesn't return anything if level is not found
    // level 1 returns root value
    printLevel(node, level) {
      if (!node) {
        return;
      }
      if (level === 1) {
        console.log(`${node.value} `);
      } else if (level > 1) {
        this.printLevel(node.left, level - 1);
        this.printLevel(node.right, level - 1);
      }
    }

    prettyPrint(node, prefix = '', isLeft = true) {
      if (node.right !== null) {
        this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
      }
      console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
      if (node.left !== null) {
        this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
      }
    }

    isBalanced() {
      if(this.root === null) return true;

      const queue = [this.root];

      while (queue.length > 0) {
          const current = queue.shift();
          if (Math.abs(this.height(current.left) - this.height(current.right)) > 1) {
              return false;
          }
          // If the current node has children, add them to queue.
          if (current.left !== null) queue.push(current.left);
          if (current.right !== null) queue.push(current.right);
      }
      // If the whole loop goes through without issues, return true
      return true;
  }

  rebalance() {
    if (this.isBalanced()) {
      return;
    }
    const dataArray = this.inOrder()
    this.root = toBST(buildTree(dataArray))
  }

  isBST(node, min, max) {
      if (!node) {
        return true;
      }
      if (node.value <= min || node.value >= max) {
        return false;
      }
      return (
        this.isBST(node.left, min, node.value) &&
        this.isBST(node.right, node.value, max)
      );
  }
}
  
  //const bst = new BinarySearchTree([3,22,45,56,6,9, -1]);
  //console.log(bst.max(bst.root));
  //bst.insertNode(bst.root, new Node(150));
  //bst.insertNode(bst.root, new Node(230))
  //bst.insertNode(bst.root, new Node(134));
  //console.log(bst.isBalanced())
  //bst.insert(150)
  //bst.insert(230)
  //bst.insert(134)
  //console.log(bst.isBalanced())
  //console.log(bst.inOrder());
  //console.log(bst.root)
  //bst.prettyPrint(bst.root)
  //bst.deleteNode(bst.root, 134);
  //bst.prettyPrint(bst.root)
  //console.log(bst.isBST(bst.root, bst.min(bst.root), bst.max(bst.root)));
  //bst.rebalance()
  //console.log(bst.isBalanced())
  //bst.prettyPrint(bst.root)
  //bst.printLevel(bst.root, 1)
  //bst.deleteNode(bst.getRoot(), new Node(134));
  //console.log(bst.inOrder())
  //console.log(bst.height(bst.root));
  //bst.insert(10);
  //bst.insert(5)
  //bst.insert(15);
  //bst.insert(3);
  //bst.insert(7);

  function buildTree(array){
    let noDuplicateArray = new Set([...array]);
    let sortedArray = mergeSort([...noDuplicateArray])
    return sortedArray
  }

  function toBST(array, left=0, right=array.length-1){
    if(left > right) return null;

    let mid = Math.floor((left+right)/2)
    let root = new Node(array[mid])
    root.left = toBST(array, left, mid-1)
    root.right = toBST(array,mid+1, right)
    return root
  }

  // Driver 
  // Per directions - not required to test delete method
  function driver(){
    let randomArray = Array.from({length: 10}, ()=> Math.floor(Math.random() * 99))
    const bst = new BinarySearchTree(randomArray);
    bst.prettyPrint(bst.root)
    console.log('balanced ?', bst.isBalanced())
    console.log('levelOrder', bst.levelOrder())
    console.log('preOrder', bst.preOrder())
    console.log('postOrder', bst.postOrder())
    console.log('inOrder', bst.inOrder())
    bst.insert(170)
    bst.insert(250)
    bst.insert(114)
    bst.prettyPrint(bst.root)
    console.log('balanced ?', bst.isBalanced())
    bst.rebalance()
    bst.prettyPrint(bst.root)
    console.log('balanced ?', bst.isBalanced())
    console.log('levelOrder', bst.levelOrder())
    console.log('preOrder', bst.preOrder())
    console.log('postOrder', bst.postOrder())
    console.log('inOrder', bst.inOrder())
  }

  driver()