# escape=`

ARG BASE_IMAGE
ARG SXA_IMAGE
ARG TOOLING_IMAGE
ARG HEADLESS_IMAGE


FROM ${HEADLESS_IMAGE} as headless
FROM ${TOOLING_IMAGE} as tooling
FROM ${SXA_IMAGE} as sxa
FROM ${BASE_IMAGE}

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# Copy development tools and entrypoint
COPY --from=tooling \tools\ \tools\

WORKDIR C:\inetpub\wwwroot

# Add SXA module
COPY --from=sxa \module\cd\content .\
COPY --from=sxa \module\tools \module\tools

RUN C:\module\tools\Initialize-Content.ps1 -TargetPath .\; `
  Remove-Item -Path C:\module -Recurse -Force;

# Add Headless files
COPY --from=headless C:\module\cd\content .\
COPY --from=headless C:\module\tools C:\module\tools

RUN C:\module\tools\Initialize-Content.ps1 -TargetPath .\; `
  Remove-Item -Path C:\module -Recurse -Force;