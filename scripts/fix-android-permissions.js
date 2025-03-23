const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to fix gradlew file permissions
const fixAndroidPermissions = () => {
    try {
        const gradlewPath = path.resolve(__dirname, '../android/gradlew');

        if (fs.existsSync(gradlewPath)) {
            // Make the gradlew file executable
            fs.chmodSync(gradlewPath, '755');
            console.log('Fixed permissions for android/gradlew');
        } else {
            console.log('android/gradlew not found. Make sure the Android platform is added.');
        }
    } catch (error) {
        console.error('Error fixing Android permissions:', error);
    }
};

fixAndroidPermissions(); 