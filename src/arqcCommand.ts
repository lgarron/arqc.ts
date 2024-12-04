export const arqcCommand = {
	path: "/Applications/Arq.app/Contents/Resources/arqc",
};
export function setArqcCommandPath(newPath: string) {
	arqcCommand.path = newPath;
}
