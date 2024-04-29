## Project Details

- Sitecore XM 10.4.0-ltsc2022
- SPE 7.0
- SXA 10.4
- Headless Services 22
- Custom Images:
  - Windows Hosts Writer
  - Solr Init Standalone

## Requirements

- Docker Desktop 4.27.2 (other versions have stability issues with windows containers)

## Setup Steps

0. Make sure you've stopped IIS and Solr:

   `iisreset /stop`

   `Stop-Service -Name "<the name of your service>"`

   or

   `nssm stop "<the name of your service>"`

1. Initialize your local docker environment: `.\init.ps1 -LicenseXmlPath <path_to_license>\.xml -ProjectName <whatever>`
   - Make sure that the path to your license file is not too long (ex. C:\licenses\license.xml) and not expired
2. Build your Tools Images: `docker compose -f .\docker-compose.build.yml build tools`
3. Build your NodeJs Images: `docker compose -f .\docker-compose.build.yml build nodejs`
4. Build your Sitecore Images: `docker compose -f .\docker-compose.build.yml build`
   - When it's done, you can run `docker images <whatever>*` and you should see something like this:
     | <div style="width:30px">REPOSITORY</div> | <div style="width:10px">TAG</div> | <div style="width:10px">IMAGE ID</div> | <div style="width:10px">CREATED</div> | <div style="width:15px">SIZE</size> |
     | ---------------------------------------- | --------------------------------- | -------------------------------------- | ------------------------------------- | ----------------------------------- |
     | whatever-solr-init | latest | 5b437ae0ad9c | About a minute ago | 5.77GB |
     | whatever-mssql-init | latest | 072e70edea5f | About a minute ago | 5.84GB |
     | whatever-cm | latest | fba4a9fdb979 | 2 minutes ago | 9.44GB |
     | whatever-id | latest | 7290cf235c37 | 9 days ago | 639MB |
5. Initialize your Sitecore Environment: `docker compose -f .\docker-compose.init.yml up`
   - This process will take a little bit. Ensure that you see "Set Sitecore admin password"
   - Once you do, hit Ctrl + C
6. Start Sitecore: `docker compose up -d --remove-orphans` (--remove-orphans first time only)
7. Open https://cm.whatever.local/sitecore for CM
8. At this point, you can create your headless application and map it into the rendering container (and disable the "replicas: 0")
