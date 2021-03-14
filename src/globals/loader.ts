export function registerPlugin(name: string, { ctx }: { ctx: any }) {
  window.roamEnhance._plugins[name] = {
    ctx
  };
}
