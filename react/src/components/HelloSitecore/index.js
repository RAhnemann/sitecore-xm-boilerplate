import React from 'react';
import { Image, Text } from '@sitecore-jss/sitecore-jss-react';


//css
import './index.scss';

function HelloSitecore({ params={}, sitecoreContext={}}) {

  return (
    <div id="CenterColumn">
      <div id="InnerCenter">
        <div id="Header">
          {/* <Image media={Logo} /> */}
          <img src="-/media/Default Website/sc_logo.ashx" alt="Sitecore" id="scLogo" />
        </div>
        <div id="Content">
          <div id="LeftContent">
            <div><h1 class="contentTitle"><Text field={sitecoreContext?.route?.fields?.Title} /></h1>
            <div class="contentDescription"><p><Text field={sitecoreContext?.route?.fields?.BodyText}/></p>
            </div></div>
          </div>
        </div>
        <div id="Footer"><hr class="divider" />&#169; 2022 Sitecore at Rightpoint</div>
      </div>
    </div>
  );
}

export default HelloSitecore;
