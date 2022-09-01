[CmdletBinding()]
Param (
    [Parameter(Mandatory = $true)]
    [string]
    [ValidateNotNullOrEmpty()]
    $LicenseXmlPath,
    
    # We do not need to use [SecureString] here since the value will be stored unencrypted in .env,
    # and used only for transient local example environment.
    [string]
    $SitecoreAdminPassword = "b",
    
    # We do not need to use [SecureString] here since the value will be stored unencrypted in .env,
    # and used only for transient local example environment.
    [string]
    $SqlSaPassword = "Password12345!",

    [string]
    $Project = "sitecore102"
)

$ErrorActionPreference = "Stop";

if (-not (Test-Path $LicenseXmlPath)) {
    throw "Did not find $LicenseXmlPath"
}
if (-not (Test-Path $LicenseXmlPath -PathType Leaf)) {
    throw "$LicenseXmlPath is not a file"
}

if(-not (Test-PAth ".env"))
{
    Write-Host "Copying new .env" -ForegroundColor Green
    Copy-Item ".\docker\.env" ".\.env"
}

# Check for Sitecore Gallery
Import-Module PowerShellGet
$SitecoreGallery = Get-PSRepository | Where-Object { $_.SourceLocation -eq "https://sitecore.myget.org/F/sc-powershell/api/v2" }
if (-not $SitecoreGallery) {
    Write-Host "Adding Sitecore PowerShell Gallery..." -ForegroundColor Green 
    Register-PSRepository -Name SitecoreGallery -SourceLocation https://sitecore.myget.org/F/sc-powershell/api/v2 -InstallationPolicy Trusted
    $SitecoreGallery = Get-PSRepository -Name SitecoreGallery
}
# Install and Import SitecoreDockerTools 
$dockerToolsVersion = "10.2.7"
Remove-Module SitecoreDockerTools -ErrorAction SilentlyContinue
if (-not (Get-InstalledModule -Name SitecoreDockerTools -RequiredVersion $dockerToolsVersion -ErrorAction SilentlyContinue)) {
    Write-Host "Installing SitecoreDockerTools..." -ForegroundColor Green
    Install-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion -Scope CurrentUser -Repository $SitecoreGallery.Name
}
Write-Host "Importing SitecoreDockerTools..." -ForegroundColor Green
Import-Module SitecoreDockerTools -RequiredVersion $dockerToolsVersion
Write-SitecoreDockerWelcome

###############################
# Populate the environment file
###############################

Write-Host "Populating required .env file variables..." -ForegroundColor Green

# COMPOSE_PROJECT_NAME
Set-EnvFileVariable "COMPOSE_PROJECT_NAME" -Value $Project

# CD_HOST
Set-EnvFileVariable "CD_HOST" -Value "$Project-cd.dev.localhost"

# CM_HOST
Set-EnvFileVariable "CM_HOST" -Value "$Project-cm.dev.localhost"

# ID_HOST
Set-EnvFileVariable "ID_HOST" -Value "$Project-id.dev.localhost"

# SITECORE_ADMIN_PASSWORD
Set-EnvFileVariable "SITECORE_ADMIN_PASSWORD" -Value $SitecoreAdminPassword

# SQL_SA_PASSWORD
Set-EnvFileVariable "SQL_SA_PASSWORD" -Value $SqlSaPassword

# REPORTING_API_KEY = random 64-128 chars
Set-EnvFileVariable "REPORTING_API_KEY" -Value (Get-SitecoreRandomString 64 -DisallowSpecial)

# TELERIK_ENCRYPTION_KEY = random 64-128 chars
Set-EnvFileVariable "TELERIK_ENCRYPTION_KEY" -Value (Get-SitecoreRandomString 128 -DisallowSpecial)

# MEDIA_REQUEST_PROTECTION_SHARED_SECRET
Set-EnvFileVariable "MEDIA_REQUEST_PROTECTION_SHARED_SECRET" -Value (Get-SitecoreRandomString 64 -DisallowSpecial)

# SITECORE_IDSECRET = random 64 chars
Set-EnvFileVariable "SITECORE_IDSECRET" -Value (Get-SitecoreRandomString 64 -DisallowSpecial)

# SITECORE_ID_CERTIFICATE
$idCertPassword = Get-SitecoreRandomString 12 -DisallowSpecial
Set-EnvFileVariable "SITECORE_ID_CERTIFICATE" -Value (Get-SitecoreCertificateAsBase64String -DnsName "localhost" -Password (ConvertTo-SecureString -String $idCertPassword -Force -AsPlainText))

# SITECORE_ID_CERTIFICATE_PASSWORD
Set-EnvFileVariable "SITECORE_ID_CERTIFICATE_PASSWORD" -Value $idCertPassword

# SITECORE_LICENSE
Set-EnvFileVariable "SITECORE_LICENSE" -Value (ConvertTo-CompressedBase64String -Path $LicenseXmlPath)

##################################
# Configure TLS/HTTPS certificates
##################################

Push-Location docker\traefik\certs
try {
    $mkcert = ".\mkcert.exe"
    if ($null -ne (Get-Command mkcert.exe -ErrorAction SilentlyContinue)) {
        # mkcert installed in PATH
        $mkcert = "mkcert"
    } elseif (-not (Test-Path $mkcert)) {
        Write-Host "Downloading and installing mkcert certificate tool..." -ForegroundColor Green 
        Invoke-WebRequest "https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-windows-amd64.exe" -UseBasicParsing -OutFile mkcert.exe
        if ((Get-FileHash mkcert.exe).Hash -ne "1BE92F598145F61CA67DD9F5C687DFEC17953548D013715FF54067B34D7C3246") {
            Remove-Item mkcert.exe -Force
            throw "Invalid mkcert.exe file"
        }
    }
    Write-Host "Generating Traefik TLS certificate..." -ForegroundColor Green
    & $mkcert -install
    & $mkcert -key-file key.pem -cert-file cert.pem "*.dev.localhost"
}
catch {
    Write-Host "An error occurred while attempting to generate TLS certificate: $_" -ForegroundColor Red
}
finally {
    Pop-Location
}

Write-Host "Done!" -ForegroundColor Green