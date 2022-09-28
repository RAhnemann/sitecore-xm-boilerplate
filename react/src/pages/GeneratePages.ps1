#Requires -Version 7.0

if($args.Count -ne 1)
{
    throw "Please specify exactly one page type"
}

$page = $args[0]

#Path Data
$pagesFolder = $PSScriptRoot 

$pageTemplateFolder = Join-Path $PSScriptRoot "_template"
$publicFolder = Join-Path $PSScriptRoot "../../public/local"

$scjssConfigFile = "./scjssconfig.json"
$pageMapFile = "./src/pages/pageMap.json"
#do some validation
if (-not (Test-Path -Path $scjssConfigFile -PathType Leaf)) {
    throw "Couldn't find scjssconfig"
}

if (-not (Test-Path -Path $pageMapFile -PathType Leaf)) {
    throw "Couldn't find scjssconfig"
}


#Load up the Configs and find the appropriate page
$scConfig = Get-Content -Raw -Path $scjssConfigFile | ConvertFrom-Json
$pageMaps = Get-Content -Raw -Path $pageMapFile | ConvertFrom-Json

$pageMap = $pageMaps.Pages | Where-Object { $_.Name -eq $page }

if (-not $pageMap) {
    Throw "Could not find a map for $page"
}

$itemPath = $pageMap.Url
$pageName = $pageMap.Name

$pagePath = Join-Path $pagesFolder $pageName
$pagePublicFolder = Join-Path $publicFolder $pageName

$origin = $scConfig.sitecore.layoutServiceHost
$apiKey = $scConfig.sitecore.apiKey

$requestUri = "${origin}/sitecore/api/layout/render/jss?item=${itemPath}&sc_apikey=${apiKey}"

Write-Host "RequestUri: ${RequestUri}"

#Cleanup
if (Test-Path $pagePath) {
    Remove-Item $pagePath -Recurse -Force
}

if (Test-Path $pagePublicFolder) {
    Remove-item $pagePublicFolder -Force -Recurse
}

#Grab the content
$page = Invoke-WebRequest -Uri $requestUri -UseBasicParsing

$dataFilePath = Join-Path $pagePath "page-data.json"

#Create the Folder and copy template data

New-Item $pagePath -ItemType Directory

Copy-Item "$pageTemplateFolder\*" $pagePath -Recurse

#replace tokens in the index.stories.js
$storyPath = Join-Path $pagePath "index.stories.js"
((Get-Content -path $storyPath -Raw) -replace "__PageName__", $pageName) | Set-Content -Path $storyPath

#Process Associated Images
$pageData = $page.Content

$pageData = $pageData.Replace("[[PageName]]", $pageName)

$pageData = $pageData.Replace("${origin}/-/media/", "/-/media/")

$matches = ([regex]'\"src\":\"(.*?)\"').Matches($pageData);

foreach ($match in $matches) {
    $fullMatch = $match.Groups[1].Value
    Write-Host "Found Image: " $fullMatch

    $fullUrl = $fullMatch.Replace("/-/media/", "")

    if ($match.Value.IndexOf("?") -gt 0) {
        $fullUrl = $fullUrl.Split("?")[0]
    }
  
    $imagePath = Join-Path $publicFolder $pageName $fullUrl.Replace("/", "\")

    $imageFolder = Split-Path -Path $imagePath
    
    Write-Host $imageFolder
    
    if (-not (Test-Path $imageFolder)) {
        New-Item -ItemType Directory -Path $imageFolder
    }

    Write-Host "Downloading Image: ${origin}${fullMatch}"

    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile("${origin}${fullMatch}", $imagePath)

    $pageData = $pageData.Replace($match.Groups[1].Value, "/local/${pageName}/${fullUrl}");
}
$pageData | Out-File $dataFilePath