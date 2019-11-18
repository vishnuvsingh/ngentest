const path = require('path');
const fs = require('fs');

const Base = require('../common-test-functions.js');

class ComponentTestGen {
  constructor (tsPath) {
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
    } else {
      throw new Error(`Error. invalid typescript file. e.g., Usage $0 ${tsPath} [options]`);
    }

    // this.template;
    this.tsPath = tsPath;
    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');

    this._getInputs = Base.getInputs.bind(this);
    this._getOutputs = Base.getOutputs.bind(this);
    this._getItBlocks = Base.getItBlocks.bind(this);
    this._getImports = Base.getImports.bind(this);
    this._getProviders = Base.getProviders.bind(this);
    this.getProviderMocks = Base.getProviderMocks.bind(this);
    this.getGenerated = Base.getGenerated.bind(this);
    this.writeGenerated = Base.writeGenerated.bind(this);
    this.getKlass = Base.getKlass.bind(this);
    this.getKlassImports = Base.getKlassImports.bind(this);
  }

  async getData () {
    this.klass = await this.getKlass();
    this.imports = await this.getKlassImports();

    return {
      klass: this.klass,
      typescript: this.typescript,
      ejsData: this.getEjsData()
    };
  }

  getEjsData () {
    const result = {};
    this.template = fs.readFileSync(path.join(__dirname, 'component.template.ts.ejs'), 'utf8');

    result.className = this.klass.name;
    result.inputs = this._getInputs(this.klass);
    result.outputs = this._getOutputs(this.klass);
    result.providers = this._getProviders(this.klass);
    // result.windowMocks = this._getWindowMocks(this.klass);
    result.functionTests = this._getItBlocks(this.klass);
    result.imports = this._getImports(this.klass);
    result.parsedImports = this.imports;

    return result;
  }

}

module.exports = ComponentTestGen;