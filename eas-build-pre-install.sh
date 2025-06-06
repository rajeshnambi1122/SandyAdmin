#!/bin/bash

# Create the android/app directory if it doesn't exist
mkdir -p android/app

# Create google-services.json file
cat > android/app/google-services.json << 'EOL'
{
  "project_info": {
    "project_number": "757306243529",
    "project_id": "sandymarket-4e8e9",
    "storage_bucket": "sandymarket-4e8e9.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:757306243529:android:5539ca0738eb5eee3f9018",
        "android_client_info": {
          "package_name": "com.sandysmarket.admin"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSyANVivOQ_XKvdOJbscn6W242V5q20Ww7wk"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}
EOL

echo "Created google-services.json file" 