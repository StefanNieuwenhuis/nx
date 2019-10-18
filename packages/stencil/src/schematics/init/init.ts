import { Rule, chain } from '@angular-devkit/schematics';
import { JsonObject } from '@angular-devkit/core';
import { addDepsToPackageJson, updateJsonInTree, updateWorkspace, addPackageWithInit, formatFiles } from '@nrwl/workspace';
import { frameworkVersion } from '../../utils/versions';

export function addDependencies(): Rule {
    return addDepsToPackageJson(
        { '@stencil/core': frameworkVersion },
        {}
    );
}
function moveDependency(): Rule {
    return updateJsonInTree('package.json', json => {
        json.dependencies = json.dependencies || {};

        delete json.dependencies['@nrwl/web'];
        return json;
    });
}

function setDefault(): Rule {
    return updateWorkspace(workspace => {
        workspace.extensions.cli = workspace.extensions.cli || {};

        const defaultCollection: string =
            workspace.extensions.cli &&
            ((workspace.extensions.cli as JsonObject).defaultCollection as string);

        if (!defaultCollection || defaultCollection === '@nrwl/workspace') {
            (workspace.extensions.cli as JsonObject).defaultCollection = '@nrwl/stencil';
        }
    });
}

export default function (schema: Schema) {
    return chain([
        setDefault(),
        addPackageWithInit('@nrwl/jest'),
        addPackageWithInit('@nrwl/cypress'),
        addDependencies(),
        moveDependency(),
        formatFiles(schema)
    ]);
}
