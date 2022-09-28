import React, { useRef, useEffect } from 'react';
import { RichText, mediaApi, isEditorActive } from '@sitecore-jss/sitecore-jss-react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { handleAnchorOffset, handleAnchorOffsetUrlHash } from '../../lib/HelperFunctions';

/**
 * A wrapper around JSS's RichText that handles routing from links in the rich text
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.editable]
 * @param {import('@sitecore-jss/sitecore-jss-react').RichTextField} [props.field]
 */
const RoutableRichText = ({ className, editable = true, field = {}, ...otherProps }) => {
  const history = useHistory();
  const richTextRef = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    const routeHandler = (event) => {
      event.preventDefault();
      history.push(event.target.pathname);
    };

    if (!richTextRef.current) return;

    const hasText = field && field.value;
    const isEditing = editable && field.editable;

    if (hasText && !isEditing) {
      // selects all links that start with '/' - this logic may be inappropriate for some advanced uses
      const internalLinks = richTextRef.current.querySelectorAll('a[href^="/"]');
      internalLinks.forEach((link) => {
        link.addEventListener('click', routeHandler, false);
      });

      return function cleanup() {
        internalLinks.forEach((link) => {
          link.removeEventListener('click', routeHandler, false);
        });
      };
    }
  }, [history, editable, field, richTextRef]);

  useEffect(() => {
    if (!richTextRef.current) return;

    const hasText = field && field.value;
    const isEditing = editable && field.editable;

    if (hasText && !isEditing) {
      handleAnchorOffset(richTextRef.current);
      //trigger anchor offset on popstate event
      window.addEventListener('popstate', handleAnchorOffsetUrlHash);
      //offset anchor on first load.
      handleAnchorOffsetUrlHash();
      //remove popstate event on dispose
      return () => window.removeEventListener('popstate', handleAnchorOffsetUrlHash);
    }
  }, [pathname, editable, field, richTextRef]);

  useEffect(() => {
    if (!richTextRef.current) return;
    const hasText = field && field.value;
    const isEditing = editable && field.editable;

    if (hasText && !isEditing) {
      // selects all links that start with '/' - this logic may be inappropriate for some advanced uses
      const images = richTextRef.current.querySelectorAll('img[src*="-/media/"]');

      images.forEach((image) => {
        image.src = mediaApi.updateImageUrl(image.src);
      });
    }
  }, [editable, field, richTextRef]);

  // prevent empty <div></div> from showing up when there's no rich text to render
  if (!isEditorActive() && !field.value) return null;

  return (
    <div className={className} ref={richTextRef}>
      <RichText {...otherProps} editable={editable} field={field} />
    </div>
  );
};

export { RoutableRichText };
