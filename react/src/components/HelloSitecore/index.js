import React from 'react';
import { Image, Text } from '@sitecore-jss/sitecore-jss-react';


//css
import './index.scss';

function HelloSitecore({ fields = {}}) {
  const { Title, BodyText, Logo} = fields;


  return (
    <div id="CenterColumn">
      <div id="InnerCenter">
        <div id="Header">
          <Image media={Logo} />
          <img src="-/media/Default Website/sc_logo.ashx" alt="Sitecore" id="scLogo" />
        </div>
        <div id="Content">
          <div id="LeftContent">
            <div><h1 class="contentTitle"><Text field={Title} /></h1>
            <div class="contentDescription"><p><Text field={BodyText}/></p>
            </div></div>
          </div>
        </div>
        <div id="Footer"><hr class="divider" />&#169; 2022 Sitecore</div>
      </div>
    </div>
  );
}

export default HelloSitecore;
