# escape=`

ARG BASE_IMAGE
ARG SXA_IMAGE
ARG SPE_IMAGE
ARG TOOLING_IMAGE
ARG HEADLESS_IMAGE

FROM ${TOOLING_IMAGE} as tooling
FROM ${SPE_IMAGE} as spe
FROM ${SXA_IMAGE} as sxa
FROM ${HEADLESS_IMAGE} as headless
FROM ${BASE_IMAGE}

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

ARG NODEJS_VERSION

# Copy development tools and entrypoint
COPY --from=tooling \tools\ \tools\

WORKDIR C:\inetpub\wwwroot

# Add SPE module
COPY --from=spe \module\cm\content .\

# Add SXA module
COPY --from=sxa \module\cm\content .\
COPY --from=sxa \module\tools \module\tools

RUN C:\module\tools\Initialize-Content.ps1 -TargetPath .\; `
  Remove-Item -Path C:\module -Recurse -Force;

#Add Headless module
COPY --from=headless C:\module\cm\content .\
COPY --from=headless C:\module\tools C:\module\tools

RUN C:\module\tools\Initialize-Content.ps1 -TargetPath .\; `
  Remove-Item -Path C:\module -Recurse -Force;

# Copy role transforms
COPY .\transforms\ \transforms\role\

# Perform role transforms
RUN C:\tools\scripts\Invoke-XdtTransform.ps1 -Path .\ -XdtPath C:\transforms\role

#Install Node for SSR
RUN Invoke-WebRequest -OutFile nodejs.zip -UseBasicParsing "https://nodejs.org/dist/v$env:NODEJS_VERSION/node-v$env:NODEJS_VERSION-win-x64.zip"; `
Expand-Archive nodejs.zip -DestinationPath C:\; `
Rename-Item "C:\\node-v$Env:NODEJS_VERSION-win-x64" c:\node; `
setx /M PATH $($env:PATH + ';C:\node')