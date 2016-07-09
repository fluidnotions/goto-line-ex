import * as vscode from 'vscode';

import fs = require('fs');
import path = require('path');

interface IGotoSetting {
    keyword: string;
    keywordAssociation: Object
}

/**
* Activate the extension.
*/
export function activate(context: vscode.ExtensionContext) {
    let controller = new GotoController();

    context.subscriptions.push(vscode.commands.registerCommand('goto-line-ex.fromHere', controller.GoFromHere, controller));
    context.subscriptions.push(vscode.commands.registerCommand('goto-line-ex.fromKeyword', controller.GoFromKeyword, controller));
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
        let document = vscode.window.activeTextEditor.document,
            keyword = this.getKeyword(path.extname(document.fileName));

        if (keyword === '') {
            vscode.window.showErrorMessage('Please define a keyword in settings');
            return;
        }

        let text = document.getText(),
            match = new RegExp('\\b'+keyword+'\\b','i'),
            matchLine = -1,
            found;

        do {
            found = match.exec(text);
            if (found) {
                matchLine = document.lineAt(document.positionAt(found.index)).lineNumber;
                break;
            }
        }
        while (found);

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

    private getKeyword(ext: string) {
        if (ext && this.settings.keywordAssociation) {
            if (ext.startsWith('.'))
                ext = ext.slice(1);
            if (this.settings.keywordAssociation[ext])
                return this.settings.keywordAssociation[ext];
        }

        return this.settings.keyword;
    }

    private readSettings(): IGotoSetting {
        let config = vscode.workspace.getConfiguration('goto-line-ex');

        return {
            keyword: <string>config.get('keyword') || '',
            keywordAssociation: config.get('keywordAssociations') || null
        }
    }
}