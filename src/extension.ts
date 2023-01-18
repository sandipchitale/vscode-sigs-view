import * as vscode from 'vscode';
import { SignatureInfoViewViewProvider } from './signatureInfoView';

export function activate(context: vscode.ExtensionContext) {
	const signatureInfoViewViewProvider = new SignatureInfoViewViewProvider(context.extensionUri);
	context.subscriptions.push(signatureInfoViewViewProvider);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SignatureInfoViewViewProvider.viewType, signatureInfoViewViewProvider));


	context.subscriptions.push(
		vscode.commands.registerCommand('sigsView.signatureInfoView.pin', () => {
			signatureInfoViewViewProvider.pin();
		}));

	context.subscriptions.push(
		vscode.commands.registerCommand('sigsView.signatureInfoView.unpin', () => {
			signatureInfoViewViewProvider.unpin();
		}));
}
