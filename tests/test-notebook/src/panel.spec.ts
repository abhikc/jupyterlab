// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import {
  ServiceManager
} from '@jupyterlab/services';

import {
  Context
} from '@jupyterlab/docregistry';

import {
  INotebookModel, NotebookPanel, Notebook
} from '@jupyterlab/notebook';

import {
  Toolbar
} from '@jupyterlab/apputils';

import {
  createNotebookContext
} from '../../utils';

import {
  DEFAULT_CONTENT, createNotebookPanelFactory, rendermime,
  mimeTypeService, editorFactory, createNotebookPanel, createNotebook
} from '../../notebook-utils';


/**
 * Default data.
 */
const contentFactory = createNotebookPanelFactory();
const options = { rendermime, mimeTypeService, contentFactory };


function createPanel(context: Context<INotebookModel>): NotebookPanel {
  const panel = createNotebookPanel(context);
  context.model.fromJSON(DEFAULT_CONTENT);
  return panel;
}


describe('@jupyterlab/notebook', () => {

  describe('NotebookPanel', () => {

    let context: Context<INotebookModel>;

    beforeEach(async () => {
      context = await createNotebookContext();
    });

    afterEach(async () => {
      await context.session.shutdown();
      context.dispose();
    });

    describe('#constructor()', () => {

      it('should create a notebook panel', () => {
        const content = createNotebook();
        const panel = new NotebookPanel({ context, content });
        expect(panel).to.be.a(NotebookPanel);
      });

      it('should initialize the model state', async () => {
        const panel = createNotebookPanel(context);
        const model = panel.content.model;
        expect(model).to.be(context.model);
        model.fromJSON(DEFAULT_CONTENT);
        expect(model.cells.canUndo).to.be(true);
        await context.initialize(true);
        await context.ready;
        expect(model.cells.canUndo).to.be(false);
      });

      it('should change notebook to edit mode if we have a single empty code cell', async () => {
        const panel = createNotebookPanel(context);
        const model = panel.content.model;
        expect(model).to.be(context.model);
        await context.initialize(true);
        await context.ready;
        expect(panel.content.mode).to.equal('edit');
      });

    });

    describe('#toolbar', () => {

      it('should be the toolbar used by the widget', () => {
        let panel = createNotebookPanel(context);
        expect(panel.toolbar).to.be.a(Toolbar);
      });

    });

    describe('#content', () => {

      it('should be the notebook content widget', () => {
        let panel = createNotebookPanel(context);
        expect(panel.content).to.be.a(Notebook);
      });

    });

    describe('#context', () => {

      it('should get the document context for the widget', () => {
        let panel = createNotebookPanel(context);
        expect(panel.context).to.be(context);
      });

    });

    describe('#dispose()', () => {

      it('should dispose of the resources used by the widget', () => {
        let panel = createNotebookPanel(context);
        panel.dispose();
        expect(panel.isDisposed).to.be(true);
      });

      it('should be safe to call more than once', () => {
        let panel = createNotebookPanel(context);
        panel.dispose();
        panel.dispose();
        expect(panel.isDisposed).to.be(true);
      });

    });

    describe.skip('.ContentFactory', () => {
      // TODO: make notebook panel still take a content factory for a notebook, and use that for a default notebook? This also moves all creation options to the notebook panel that are now just part of the content widget. That would be more backwards compatible, even if it departs a bit from our story about document widgets.
      describe('#constructor', () => {

        it('should create a new ContentFactory', () => {
          let factory = new NotebookPanel.ContentFactory({ editorFactory });
          expect(factory).to.be.a(NotebookPanel.ContentFactory);
        });

      });

      describe('#createNotebook()', () => {

        it('should create a notebook widget', () => {
          let options = {
            contentFactory: contentFactory,
            rendermime,
            mimeTypeService
          };
          expect(contentFactory.createNotebook(options)).to.be.a(Notebook);
        });

      });

    });

  });

});
