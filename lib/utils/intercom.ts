export function setIntercomVisibility(visible: boolean) {
  if (typeof window !== 'undefined') {
    const intercom = (window as any).Intercom;
    if (intercom) {
      intercom('update', { hide_default_launcher: !visible });
    }
  }
}
