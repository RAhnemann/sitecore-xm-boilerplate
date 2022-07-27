# escape=`

ARG BASE_IMAGE
ARG SPE_IMAGE
ARG HEADLESS_IMAGE
    
FROM ${SPE_IMAGE} as spe
FROM ${HEADLESS_IMAGE} as headless
FROM ${BASE_IMAGE}

COPY --from=spe C:\module\db C:\resources\spe

COPY --from=headless C:\module\db C:\resources\jss 
#Non Default Path ^