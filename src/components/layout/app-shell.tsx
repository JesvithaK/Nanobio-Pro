"use client";

import Sidebar from "./sidebar";
import Topbar from "./topbar";
import PageTransition from "../animations/page";

export default function AppShell({ children }: { children: React.ReactNode }) {
return ( <div className="flex h-screen overflow-hidden"> <Sidebar />

```
  <div className="flex flex-1 flex-col">
    <Topbar />
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        <PageTransition>{children}</PageTransition>
      </div>
    </main>
  </div>
</div>
```

);
}
