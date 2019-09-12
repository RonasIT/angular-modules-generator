import {
  apply,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
  } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { join, normalize } from 'path';
import { strings } from '@angular-devkit/core';

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src');
  return host;
}

export function domainModule(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);

    const movePath = normalize(_options.path + '/');
    const templateSource = apply(url('./files/src'), [
      template({
        ..._options,
        classify: strings.classify,
        dasherize: strings.dasherize,
      }),
      move(movePath)
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
  };
}