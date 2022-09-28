import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// components
import * as AllComponents from '../../components';

// data
import data from './page-data.json';

export default {
    title: 'pages/__PageName__',
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        options: {
            showPanel: false,
        },
    },
};

export const Default = () => {
    
    const mainData = data.sitecore?.route?.placeholders?.['jss-main'];

    return (
        <>
        
            {
                
                mainData && mainData.filter((mainElem) => {
                if (!AllComponents[mainElem.componentName]) {
                    console.warn(
                        `Missing component: ${mainElem.componentName}\n`,
                        'Check if it was exported from "src/components/index.js"'
                    );
                    return false;
                }
                return true;
            })
                .map((mainElem) => {
                    const Component = AllComponents[mainElem.componentName];

                    return (
                        <Component
                            key={mainElem.uid}
                            params={mainElem.params}
                            fields={mainElem.fields || data.sitecore?.route?.fields}
                            sitecoreContext={data.sitecore}
                        />
                    );
                })}
        </>
    );
};
