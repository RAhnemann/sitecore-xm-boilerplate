[CmdletBinding(DefaultParameterSetName = "no-arguments")]
Param (
    [Parameter(Mandatory = $true,
        HelpMessage = "The path to a valid Sitecore license.xml file.")]
    [string]$LicenseXmlPath,
    [Parameter(Mandatory = $true,
        HelpMessage = "The Name of the project. Will be used in hostnames and repository.")]
    [string]$ProjectName

)

$ErrorActionPreference = "Stop";


if (-not $LicenseXmlPath.EndsWith("license.xml")) {
    Write-Error "Sitecore license file must be named 'license.xml'."
}
if (-not (Test-Path $LicenseXmlPath)) {
    Write-Error "Could not find Sitecore license file at path '$LicenseXmlPath'."
}
# We actually want the folder that it's in for mounting
$LicenseXmlPath = (Get-Item $LicenseXmlPath).Directory.FullName


if (-not (Test-PAth ".env")) {
    Write-Host "Copying new .env" -ForegroundColor Green
    Copy-Item ".\docker\.env_source" ".\.env"
}

Write-Host "Preparing your Sitecore Containers environment!" -ForegroundColor Green

################################################
# Retrieve and import SitecoreDockerTools module
################################################

# Check for Sitecore Gallery
Import-Module PowerShellGet
$SitecoreGallery = Get-PSRepository | Where-Object { $_.SourceLocation -eq "https://sitecore.myget.org/F/sc-powershell/api/v2" }
if (-not $SitecoreGallery) {
    Write-Host "Adding Sitecore PowerShell Gallery..." -ForegroundColor Green
    Unregister-PSRepository -Name SitecoreGallery -ErrorAction SilentlyContinue
    Register-PSRepository -Name SitecoreGallery -SourceLocation https://sitecore.myget.org/F/sc-powershell/api/v2 -InstallationPolicy Trusted
    $SitecoreGallery = Get-PSRepository -Name SitecoreGallery
}

# Install and Import SitecoreDockerTools
$dockerToolsVersion = "10.3.40"
Remove-Module SitecoreDockerTools -ErrorAction SilentlyContinue
if (-not (Get-InstalledModule -Name SitecoreDockerTools -RequiredVersion $dockerToolsVersion -ErrorAction SilentlyContinue)) {
    Write-Host "Installing SitecoreDockerTools..." -ForegroundColor Green
    Install-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion -Scope CurrentUser -Repository $SitecoreGallery.Name
}
Write-Host "Importing SitecoreDockerTools..." -ForegroundColor Green
Import-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion
Write-SitecoreDockerWelcome

##################################
# Configure TLS/HTTPS certificates
##################################

Push-Location docker\traefik\certs
try {
    $mkcert = ".\mkcert.exe"
    if ($null -ne (Get-Command mkcert.exe -ErrorAction SilentlyContinue)) {
        # mkcert installed in PATH
        $mkcert = "mkcert"
    }
    elseif (-not (Test-Path $mkcert)) {
        Write-Host "Downloading and installing mkcert certificate tool..." -ForegroundColor Green
        Invoke-WebRequest "https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-windows-amd64.exe" -UseBasicParsing -OutFile mkcert.exe
        if ((Get-FileHash mkcert.exe).Hash -ne "1BE92F598145F61CA67DD9F5C687DFEC17953548D013715FF54067B34D7C3246") {
            Remove-Item mkcert.exe -Force
            throw "Invalid mkcert.exe file"
        }
    }
    Write-Host "Generating Traefik TLS certificate..." -ForegroundColor Green
    & $mkcert -install
    & $mkcert -key-file key.pem -cert-file cert.pem "*.$ProjectName.localhost"
    
    # stash CAROOT path for messaging at the end of the script
    $caRoot = "$(& $mkcert -CAROOT)\rootCA.pem"
}
catch {
    Write-Error "An error occurred while attempting to generate TLS certificate: $_"
}
finally {
    Pop-Location
}

$jssEditingSecret = Get-SitecoreRandomString 32 -DisallowSpecial

###############################
# Populate the environment file
###############################

Write-Host "Populating required .env file values..." -ForegroundColor Green

# HOST_LICENSE_FOLDER
Set-EnvFileVariable "HOST_LICENSE_FOLDER" -Value $LicenseXmlPath

Set-EnvFileVariable "COMPOSE_PROJECT_NAME" -Value $ProjectName

# CM_HOST
Set-EnvFileVariable "CM_HOST" -Value "cm.$ProjectName.localhost"

# ID_HOST
Set-EnvFileVariable "ID_HOST" -Value "id.$ProjectName.localhost"

Set-EnvFileVariable "SITECORE_GRAPHQL_UPLOADMEDIAOPTIONS_ENCRYPTIONKEY" -Value (Get-SitecoreRandomString 16 -DisallowSpecial)

# RENDERING_HOST
Set-EnvFileVariable "RENDERING_HOST" -Value "www.$ProjectName.localhost"

# REPORTING_API_KEY = random 64-128 chars
Set-EnvFileVariable "REPORTING_API_KEY" -Value (Get-SitecoreRandomString 128 -DisallowSpecial)

# TELERIK_ENCRYPTION_KEY = random 64-128 chars
Set-EnvFileVariable "TELERIK_ENCRYPTION_KEY" -Value (Get-SitecoreRandomString 128 -DisallowSpecial)

# MEDIA_REQUEST_PROTECTION_SHARED_SECRET
Set-EnvFileVariable "MEDIA_REQUEST_PROTECTION_SHARED_SECRET" -Value (Get-SitecoreRandomString 64 -DisallowSpecial)

# MEDIA_REQUEST_PROTECTION_SHARED_SECRET
Set-EnvFileVariable "SITECORE_IDSECRET" -Value (Get-SitecoreRandomString 64 -DisallowSpecial)

Set-EnvFileVariable "JSS_EDITING_SECRET" -Value $jssEditingSecret 
# SQL_SA_PASSWORD
# Need to ensure it meets SQL complexity requirements
Set-EnvFileVariable "SQL_SA_PASSWORD" -Value (Get-SitecoreRandomString 19 -DisallowSpecial -EnforceComplexity)

# SQL_SERVER
Set-EnvFileVariable "SQL_SERVER" -Value "mssql"

# SQL_SA_LOGIN
Set-EnvFileVariable "SQL_SA_LOGIN" -Value "sa"

# SITECORE_ADMIN_PASSWORD
Set-EnvFileVariable "SITECORE_ADMIN_PASSWORD" -Value "b"

Write-Host "Done!" -ForegroundColor Green

Push-Location docker\traefik\certs
try {
    Write-Host
    Write-Host ("#" * 75) -ForegroundColor Cyan
    Write-Host "To avoid HTTPS errors, set the NODE_EXTRA_CA_CERTS environment variable" -ForegroundColor Cyan
    Write-Host "using the following commmand:" -ForegroundColor Cyan
    Write-Host "setx NODE_EXTRA_CA_CERTS $caRoot"
    Write-Host
    Write-Host "You will need to restart your terminal or VS Code for it to take effect." -ForegroundColor Cyan
    Write-Host ("#" * 75) -ForegroundColor Cyan
}
catch {
    Write-Error "An error occurred while attempting to generate TLS certificate: $_"
}
finally {
    Pop-Location
}