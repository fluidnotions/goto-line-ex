import * as vscode from 'vscode';

import fs = require('fs');
import path = require('path');

interface IGotoSetting {
    keyword: string;
}

/**
* Activate the extension.
*/
export function activate(disposables: vscode.Disposable[]) {
    let controller = new GotoController();

    vscode.commands.registerCommand('goto-line-ex.fromHere', controller.GoFromHere, controller);
    vscode.commands.registerCommand('goto-line-ex.fromKeyword', controller.GoFromKeyword, controller);
}

/**
 * Controller for handling history.
 */
class GotoController {
    private settings: IGotoSetting;

    constructor() {
        this.settings = this.readSettings();
    }

    public GoFromHere() {
        let actLine = vscode.window.activeTextEditor.selection.start.line;
        this.internalJumpTo('Type a number to navigate from current postition', actLine);
    }

    public GoFromKeyword() {
        let keyword = this.settings.keyword;
        if (keyword === '') {
            vscode.window.showErrorMessage('Please defined a keyword in settings');
            return;
        }

        let text = vscode.window.activeTextEditor.document.getText(),
            atext = text.split('\n'),
            matchLine = -1,
            match = new RegExp(/\b/.source+keyword+/\b/.source,'i'); //  /\bbody\b/i;

        atext.forEach(
            function (line, number) {
                if (match.exec(line))
                    matchLine = number;
                    return;
            }
        );

        if (matchLine >= 0) {
            this.internalJumpTo('Type a number to navigate from '+ keyword +' postition', matchLine);
        }
    }

    private internalJumpTo(prompt, line) {

        vscode.window.showInputBox({prompt: prompt})
            .then(value => {
                let jump = line + parseInt(value, 10) - 1,
                    sel = new vscode.Selection(jump, 0, jump, 0);
                vscode.window.activeTextEditor.selection = sel;
                vscode.window.activeTextEditor.revealRange(sel, vscode.TextEditorRevealType.Default);
            });
    }

    private readSettings(): IGotoSetting {
        let config = vscode.workspace.getConfiguration('goto-line-ex');

        return {
            keyword: <string>config.get('keyword') || ''
        }
    }
}