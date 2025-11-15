import type { Render, Scene } from '@/lib/webgl';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Pane } from 'tweakpane';
import { exportJpg } from './ExportJpg';

export class Gui extends Pane {
  constructor() {
    super();
    this.registerPlugin(EssentialsPlugin);
  }

  addSaveBtn(render: Render, scene: Scene) {
    const EXPORT_PARAMS = {
      width: 1600,
      height: 900,
      save: () => exportJpg(render, scene, EXPORT_PARAMS.width, EXPORT_PARAMS.height),
    };

    // biome-ignore format: este array no debe ser formateado
    const saveBtnFoler = this.addFolder({title: 'Save Image', expanded: false,});
    saveBtnFoler.addBinding(EXPORT_PARAMS, 'width', { min: 256, max: 1920, step: 1 });
    saveBtnFoler.addBinding(EXPORT_PARAMS, 'height', { min: 256, max: 1920, step: 1 });

    saveBtnFoler.addButton({ title: 'Save Image' }).on('click', EXPORT_PARAMS.save);
  }
}
