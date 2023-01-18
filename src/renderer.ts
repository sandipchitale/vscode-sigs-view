import { marked } from 'marked';
import * as vscode from 'vscode';
import { CodeHighlighter } from './codeHighlighter';

export class Renderer {

	private readonly _disposables: vscode.Disposable[] = [];

	private readonly _highlighter: CodeHighlighter;

	public readonly needsRender: vscode.Event<void>;

	constructor() {
		this._highlighter = new CodeHighlighter();
		this._disposables.push(this._highlighter);

		this.needsRender = this._highlighter.needsRender;
	}

	dispose() {
		let item: vscode.Disposable | undefined;
		while ((item = this._disposables.pop())) {
			item.dispose();
		}
	}

	public async renderSignature(document: vscode.TextDocument, signatureHelp: vscode.SignatureHelp): Promise<string> {

		if (signatureHelp.signatures.length === 0) {
			return '';
		}

		let parts: any[] = [];
		const activeSignature: any[] = [];

		signatureHelp.signatures.forEach((signatureInformation: vscode.SignatureInformation, index: number) => {
			let pushTo;
			if (signatureHelp.activeSignature === index) {
				pushTo = activeSignature;
			} else {
				pushTo = parts;
			}
			pushTo.push(`\n___\n\`\`\`${signatureInformation.label}\`\`\``);
			if (signatureInformation.documentation) {
				let documentation: string;
				if (typeof signatureInformation.documentation === 'string') {
					documentation = signatureInformation.documentation;
				} else {
					documentation = (signatureInformation.documentation as vscode.MarkdownString).value;
				}

				pushTo.push(`\n\n${documentation}`);
			}
		});
		parts = [...activeSignature, ...parts];

		const markdown = parts.join('');

		const highlighter = await this._highlighter.getHighlighter(document);
		return marked(markdown, {
			highlight: highlighter,
			sanitize: true
		});
	}
}
