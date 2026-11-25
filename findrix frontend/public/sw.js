self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let datos = { title: "Findrix", body: "Tienes un recordatorio financiero.", url: "/" };
  try {
    if (event.data) datos = { ...datos, ...event.data.json() };
  } catch {
    // Mantener el mensaje genérico si el proveedor envía un payload no JSON.
  }

  event.waitUntil(
    self.registration.showNotification(datos.title, {
      body: datos.body,
      icon: "/pwa-192.png",
      badge: "/pwa-192.png",
      tag: "findrix-recordatorio",
      data: { url: datos.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destino = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientes) => {
      const existente = clientes.find((cliente) => "focus" in cliente);
      if (existente) {
        existente.navigate(destino);
        return existente.focus();
      }
      return self.clients.openWindow(destino);
    })
  );
});
