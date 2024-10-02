// test_fire.js
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

try {
  // Load the student's code
  const code = fs.readFileSync('./blacksmith.js', 'utf-8');
  
  // Set up the sandbox environment
  const sandbox = { console };
  vm.createContext(sandbox);
  
  // Execute the student's code in the sandbox
  vm.runInContext(code, sandbox);

  // Check if required variables are defined
  const requiredVariables = ['fireStatus', 'wood'];
  const undefinedVariables = requiredVariables.filter(variable => !(variable in sandbox));

  if (undefinedVariables.length > 0) {
    throw new Error(`The following required variables are not defined: ${undefinedVariables.join(', ')}`);
  }

  // Manually define the initial values for the variables
  sandbox.wood = 1;         // Initial wood value
  sandbox.fireStatus = false;  // Initial fire status

  // Extract the functions from the sandbox
  const { fire } = sandbox;

  // Ensure the fire function exists
  if (typeof fire !== 'function') {
    throw new Error("Function 'fire' is not defined.");
  }

  // Use Case 1: Start the fire when there is enough wood and the fire is not already burning
  sandbox.wood = 1;
  sandbox.fireStatus = false;
  fire();
  assert.strictEqual(sandbox.fireStatus, true, "The fire should be started if there is enough wood.");
  assert.strictEqual(sandbox.wood, 0, "One piece of wood should be consumed when starting the fire.");

  // Use Case 2: Stop the fire when the fire is currently burning
  sandbox.fireStatus = true;  // Fire is burning
  fire();
  assert.strictEqual(sandbox.fireStatus, false, "The fire should be stopped if it is currently burning.");

  // Use Case 3: Try to start the fire when there is not enough wood (should not start)
  sandbox.wood = 0;
  sandbox.fireStatus = false;
  fire();
  assert.strictEqual(sandbox.fireStatus, false, "The fire should not start if there is not enough wood.");
  assert.strictEqual(sandbox.wood, 0, "Wood count should remain the same when there is not enough wood to start the fire.");

  // Use Case 4: Try to stop the fire when there is no fire burning (nothing should change)
  sandbox.fireStatus = false;  // Fire is not burning
  fire();
  assert.strictEqual(sandbox.fireStatus, false, "The fire should remain off when trying to stop it while it is not burning.");

  console.log('PASS');
} catch (error) {
  console.log('FAIL');
  console.error(error.message);
  process.exit(1);
}
