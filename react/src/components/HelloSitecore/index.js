import React from 'react';
import { Image, Text, withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';
import { RoutableRichText } from '../../react/RoutableRichText/index.js';


//css
import './index.scss';

function HelloSitecore({ fields = {} }) {

 const {
  Title = {},
  BodyText = {},
  HeroImage = {},
  LogoImage = {}
 } = fields;

  return (
    <div id="CenterColumn"  style={{ backgroundImage: `url(${HeroImage?.value?.src})` }}>
      <div id="InnerCenter">
        <div id="Header">
          <Image media={LogoImage} id="scLogo" />
        </div>
        <div id="Content">
          <div id="LeftContent">
            <div><h1 class="contentTitle"><Text field={Title} /></h1>
              <div class="contentDescription"><p><RoutableRichText field={BodyText} /></p>
              </div></div>
          </div>
        </div>
        <div id="Footer"><hr class="divider" />&#169; 2022 Sitecore at Rightpoint</div>
      </div>
    </div>
  );
}

export default withSitecoreContext()(HelloSitecore);
