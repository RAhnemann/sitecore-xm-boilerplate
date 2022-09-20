# Sitecore Biolerplate (XM)

This repo holds a basic Sitecore setup with Sitecore XM, SPE, and Headless Services, running on a latest version of docker compose
## Requirements

1. Docker Desktop 4.12.1
2. Enable docker compose v2 - `docker compose enable-v2`

## Setup Steps

0. Make sure you've stopped IIS and Solr:  
1. Initialize your local docker environment: `.\init.ps1 -LicenseXmlPath <path_to_license> -Project <project name>`
    * I'm using "demo" as a project name in the below
2. Build your Docker Images: `docker compose -f .\docker-compose.build.yml build`  
   * When it's done, you can run `docker images demo*` and you should see something like this:
      
      |<div style="width:30px">REPOSITORY</div> |<div style="width:10px">TAG</div> |<div style="width:10px">IMAGE ID</div> |<div style="width:10px">CREATED</div>|<div style="width:15px">SIZE</size>|  
      |---|---|---|---|---|  
      |demo-solr-init | latest | 5b437ae0ad9c | About a minute ago | 5.77GB|  
      |demo-mssql-init | latest | 072e70edea5f | About a minute ago | 5.84GB|  
      |demo-cm | latest | fba4a9fdb979 | 2 minutes ago | 9.44GB|  
      |demo-cd | latest | f72a266fafc2 | 3 minutes ago | 9.39GB|  
      |demo-id | latest | 7290cf235c37 | 9 days ago | 639MB|  
      |demo-redis | latest | d537e7fb9229 | 9 days ago | 280MB|  
      
3. Initialize your Sitecore Environment: `docker compose -f .\docker-compose.override-init.yml up -d`  
   * This process may take a little time.  You need to wait until both init containers have exited before you proceed. The following command will return a list of exited containers `docker container ls -f "status=exited"`  
4. Start Sitecore: `docker compose up -d --remove-orphans`  
   * You won't need the `remove-orphans` after the first time you run this.  
5. Deploy your code into the .\docker\deploy\website folder and magics!

# Configuring the Content Hub Connector

This guide follows along with https://doc.sitecore.com/xp/en/developers/connect-for-ch/50/connect-for-content-hub/walkthrough--preparing-to-install-the-scch-connector-module-in-a-container-environment.html

