using System.Collections.Generic;
using System.Linq;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.LayoutService.Configuration;
using Sitecore.LayoutService.ItemRendering;
using Sitecore.LayoutService.Presentation.Pipelines.RenderJsonRendering;
using Sitecore.LayoutService.Serialization;
using Sitecore.Mvc.Presentation;

namespace Demo.Foundation.Pipelines.LayoutService
{
    /// <summary>
    /// Initalize pipeline.
    /// </summary>
    public class InitializeJsonRendering : Initialize
    {
        private IRenderingConfiguration renderingConfiguration;

        /// <summary>
        /// Initializes a new instance of the <see cref="InitializeJsonRendering"/> class.
        /// constructor.
        /// </summary>
        /// <param name="configuration">Default Configuration.</param>
        public InitializeJsonRendering(IConfiguration configuration)
            : base(configuration)
        {
        }

        /// <summary>
        /// CreateResultInstance.
        /// </summary>
        /// <param name="args">arguments.</param>
        /// <returns>Rendered JSON.</returns>
        protected override RenderedJsonRendering CreateResultInstance(RenderJsonRenderingArgs args)
        {
            this.renderingConfiguration = args.RenderingConfiguration;

            string componentName = this.GetComponentName(args.Rendering?.RenderingItem?.InnerItem);

            // Note: the constructor below is different for Sitecore 9.x and 10. The below will only work in Headless Services for Sitecore 10.
            return new RenderedJsonRendering()
            {
                ComponentName = componentName ?? args.Rendering.RenderingItem.Name,
                DataSource = args.Rendering.DataSource,
                RenderingParams = this.SerializeRenderingParams(args.Rendering),
                Uid = args.Rendering.UniqueId,
            };
        }

        /// <summary>
        /// SerializeRenderingParams.
        /// </summary>
        /// <param name="rendering">Serialize Rendering Params.</param>
        /// <returns>Rendered Params.</returns>
        protected virtual IDictionary<string, string> SerializeRenderingParams(Rendering rendering)
        {
            IDictionary<string, string> paramDictionary = rendering.Parameters.ToDictionary(pair => pair.Key, pair => pair.Value);
            foreach (string key in paramDictionary.Keys.ToList())
            {
                if (ID.TryParse(paramDictionary[key], out var itemId))
                {
                    Item item = rendering.RenderingItem.Database.GetItem(itemId);
                    paramDictionary[key] = this.renderingConfiguration.ItemSerializer.Serialize(item, new SerializationOptions() { DisableEditing = true });
                }
            }

            return paramDictionary;
        }
    }
}