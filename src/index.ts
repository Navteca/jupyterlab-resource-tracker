import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { inspectorIcon } from '@jupyterlab/ui-components';
import { requestAPI } from './handler';

import { DashboardWidget } from './widgets/DashboardWidget';

const PLUGIN_ID = 'jupyterlab-resource-tracker:plugin';
const PALETTE_CATEGORY = 'Admin tools';
namespace CommandIDs {
  export const createNew = 'jupyterlab-resource-tracker:open-dashboard';
}

/**
 * Initialization data for the jupyterlab-resource-tracker extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'A JupyterLab extension.',
  autoStart: true,
  optional: [ISettingRegistry, ILauncher, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    settingRegistry: ISettingRegistry | null,
    launcher: ILauncher | null,
    palette: ICommandPalette | null
  ) => {
    console.log('JupyterLab extension jupyterlab-resource-tracker is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupyterlab-resource-tracker settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for jupyterlab-resource-tracker.', reason);
        });
    }

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_resource_tracker server extension appears to be missing.\n${reason}`
        );
      });

    const { commands } = app;
    const command = CommandIDs.createNew;

    // const sideBarContent = new NBQueueSideBarWidget(s3BucketId);
    // const sideBarWidget = new MainAreaWidget<NBQueueSideBarWidget>({
    //   content: sideBarContent
    // });
    // sideBarWidget.toolbar.hide();
    // sideBarWidget.title.icon = runIcon;
    // sideBarWidget.title.caption = 'NBQueue job list';
    // app.shell.add(sideBarWidget, 'right', { rank: 501 });

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = () => {
      // Create a blank content widget inside of a MainAreaWidget
      const dashboardContent = new DashboardWidget();
      const widget = new MainAreaWidget<DashboardWidget>({
        content: dashboardContent
      });
    
      widget.id = 'resource-tracker-dashboard';
      widget.title.label = 'Resource Tracker';
      widget.title.closable = true;
      return widget;
    }
    let widget = newWidget();

    commands.addCommand(command, {
      label: 'Resource Tracker',
      caption: 'Resource Tracker',
      icon: args => (args['isPalette'] ? undefined : inspectorIcon),
      execute: async args => {
        console.log('Command executed');
        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = newWidget();
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    if (launcher) {
      launcher.add({
        command,
        category: 'Admin tools',
        rank: 1
      });
    }

    if (palette) {
      palette.addItem({
        command,
        args: { isPalette: true },
        category: PALETTE_CATEGORY
      });
    }
  }
};

export default plugin;
