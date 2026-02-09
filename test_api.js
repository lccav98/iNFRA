async function testAPI() {
    try {
        console.log('Testing Materials API...');
        const materialsRes = await fetch('http://localhost:5001/api/materiais');
        const materials = await materialsRes.json();
        console.log('Materials:', materials.length, 'items');
        
        console.log('\nTesting Equipment API...');
        const equipmentRes = await fetch('http://localhost:5001/api/equipamentos');
        const equipment = await equipmentRes.json();
        console.log('Equipment:', equipment.length, 'items');
        console.log('Equipment sample:', JSON.stringify(equipment[0], null, 2));
        
        console.log('\nTesting Allocations API...');
        const allocationsRes = await fetch('http://localhost:5001/api/alocacoes');
        const allocations = await allocationsRes.json();
        console.log('Allocations:', allocations.length, 'items');
        console.log('Allocations sample:', JSON.stringify(allocations[0], null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testAPI();
