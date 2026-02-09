async function testLogisticsAPI() {
    console.log('=== Testing Logistics APIs ===\n');
    
    try {
        // Test Materials
        console.log('1. Testing Materials API:');
        const materialsRes = await fetch('http://localhost:5001/api/materiais');
        const materials = await materialsRes.json();
        console.log(`   ✓ Found ${materials.length} materials`);
        if (materials.length > 0) {
            console.log('   Sample:', {
                id: materials[0].id,
                name: materials[0].name,
                status: materials[0].status,
                hasUpdatedAt: !!materials[0].updated_at
            });
        }
        
        // Test Equipment
        console.log('\n2. Testing Equipment API:');
        const equipmentRes = await fetch('http://localhost:5001/api/equipamentos');
        const equipment = await equipmentRes.json();
        console.log(`   ✓ Found ${equipment.length} equipment items`);
        if (equipment.length > 0) {
            console.log('   Sample:', {
                id: equipment[0].id,
                name: equipment[0].name,
                status: equipment[0].status,
                hasCurrentServiceId: !!equipment[0].current_service_id
            });
        }
        
        // Test Allocations
        console.log('\n3. Testing Allocations API:');
        const allocationsRes = await fetch('http://localhost:5001/api/alocacoes');
        const allocations = await allocationsRes.json();
        console.log(`   ✓ Found ${allocations.length} allocations`);
        if (allocations.length > 0) {
            console.log('   Sample:', {
                id: allocations[0].id,
                equipment_id: allocations[0].equipment_id,
                service_name: allocations[0].service_name,
                status: allocations[0].status
            });
        }
        
        console.log('\n=== All APIs working correctly! ===');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLogisticsAPI();
