// test_buy.js
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
  const requiredVariables = ['gold', 'ore', 'wood', 'fireStatus'];
  const undefinedVariables = requiredVariables.filter(variable => !(variable in sandbox));

  // Check for both versions of 'sword' variables and unify them
  sandbox.sword = sandbox.swords || sandbox.sword;

  if (!sandbox.sword) {
    undefinedVariables.push('sword');
  }

  // Check for both versions of 'axe' variables and unify them
  sandbox.axe = sandbox.axes || sandbox.axe;

  if (!sandbox.axe) {
    undefinedVariables.push('axe');
  }

  if (undefinedVariables.length > 0) {
    throw new Error(`The following required variables are not defined: ${undefinedVariables.join(', ')}`);
  }

  // Manually define the initial values for the variables
  sandbox.gold = 10;        // Initial gold value
  sandbox.ore = 0;          // Initial ore value
  sandbox.wood = 0;         // Initial wood value
  sandbox.sword = 0;        // Initial sword count
  sandbox.axe = 0;          // Initial axe count
  sandbox.fireStatus = false;  // Initial fire status

  // Extract the functions from the sandbox
  const { buy, fire } = sandbox;

  // Ensure the function exists
  if (typeof buy !== 'function') {
    throw new Error("Function 'buy' is not defined.");
  }

  // Ensure the fire function exists
  if (typeof fire !== 'function') {
    throw new Error("Function 'fire' is not defined.");
  }

  // Use Case 1: Buy 1 piece of wood when there is enough gold and no fire is burning
  sandbox.gold = 10;
  sandbox.wood = 0;
  sandbox.fireStatus = false;
  buy('wood');
  assert.strictEqual(sandbox.gold, 9, "Gold should decrease by 1 after buying wood.");
  assert.strictEqual(sandbox.wood, 1, "Wood should increase by 1 after buying wood.");

  // Use Case 2: Buy 1 piece of ore when there is enough gold and no fire is burning
  sandbox.gold = 10;
  sandbox.ore = 0;
  sandbox.fireStatus = false;
  buy('ore');
  assert.strictEqual(sandbox.gold, 7, "Gold should decrease by 3 after buying ore.");
  assert.strictEqual(sandbox.ore, 1, "Ore should increase by 1 after buying ore.");

  // Use Case 3: Try to buy wood with insufficient gold (should not buy)
  sandbox.gold = 0;
  sandbox.wood = 0;
  sandbox.fireStatus = false;
  buy('wood');
  assert.strictEqual(sandbox.gold, 0, "Gold should remain the same when not enough gold to buy wood.");
  assert.strictEqual(sandbox.wood, 0, "Wood should remain the same when not enough gold to buy.");

  // Use Case 4: Try to buy ore with insufficient gold (should not buy)
  sandbox.gold = 2;
  sandbox.ore = 0;
  sandbox.fireStatus = false;
  buy('ore');
  assert.strictEqual(sandbox.gold, 2, "Gold should remain the same when not enough gold to buy ore.");
  assert.strictEqual(sandbox.ore, 0, "Ore should remain the same when not enough gold to buy.");

  // Use Case 5: Try to buy wood while the fire is burning (should not buy)
  sandbox.gold = 10;
  sandbox.wood = 0;
  sandbox.fireStatus = true; // Fire is burning
  buy('wood');
  assert.strictEqual(sandbox.gold, 10, "Gold should remain the same when trying to buy wood with fire burning.");
  assert.strictEqual(sandbox.wood, 0, "Wood should remain the same when fire is burning.");

  // Use Case 6: Try to buy ore while the fire is burning (should not buy)
  sandbox.gold = 10;
  sandbox.ore = 0;
  sandbox.fireStatus = true; // Fire is burning
  buy('ore');
  assert.strictEqual(sandbox.gold, 10, "Gold should remain the same when trying to buy ore with fire burning.");
  assert.strictEqual(sandbox.ore, 0, "Ore should remain the same when fire is burning.");

  console.log('PASS');
} catch (error) {
  console.log('FAIL');
  console.error(error.message);
  process.exit(1);
}
