<script setup>
import { reactive, onMounted } from 'vue'

const FUNCTIONS_BASE = 'https://rjvnmwmhfkgisnvkqphz.supabase.co/functions/v1'

const GROUP1 = [
  { name: 'group1-write', method: 'POST' },
  { name: 'group1-read-a', method: 'GET' },
  { name: 'group1-read-b', method: 'GET' },
  { name: 'group1-read-c', method: 'GET' },
]

const GROUP2 = [
  { name: 'group2-write', method: 'POST' },
  { name: 'group2-read', method: 'GET' },
]

const group1 = reactive({})
const group2 = reactive({})
const group2Loading = reactive({ active: false })

for (const fn of GROUP1) group1[fn.name] = { loading: true, data: null, error: null }
for (const fn of GROUP2) group2[fn.name] = { loading: false, data: null, error: null }

async function callFn(name, method) {
  const res = await fetch(`${FUNCTIONS_BASE}/${name}`, { method })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
  return body
}

async function loadGroup(fns, store) {
  await Promise.allSettled(
    fns.map(async (fn) => {
      store[fn.name].loading = true
      store[fn.name].error = null
      try {
        store[fn.name].data = await callFn(fn.name, fn.method)
      } catch (err) {
        store[fn.name].error = err.message
      } finally {
        store[fn.name].loading = false
      }
    }),
  )
}

function loadGroup2() {
  group2Loading.active = true
  loadGroup(GROUP2, group2).finally(() => {
    group2Loading.active = false
  })
}

onMounted(() => {
  loadGroup(GROUP1, group1)
})
</script>

<template>
  <main>
    <h1>Supabase Edge Functions Demo</h1>
    <p>Project ref: <code>rjvnmwmhfkgisnvkqphz</code></p>

    <section>
      <h2>Group 1 (1 write + 3 reads) &mdash; fired automatically on load</h2>
      <div class="cards">
        <div v-for="fn in GROUP1" :key="fn.name" class="card">
          <h3>{{ fn.name }}</h3>
          <p v-if="group1[fn.name].loading">Loading…</p>
          <p v-else-if="group1[fn.name].error" class="error">{{ group1[fn.name].error }}</p>
          <pre v-else>{{ JSON.stringify(group1[fn.name].data, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <section>
      <h2>Group 2 (1 write + 1 read) &mdash; fired on button click</h2>
      <button :disabled="group2Loading.active" @click="loadGroup2">
        {{ group2Loading.active ? 'Calling…' : 'Call Group 2 functions' }}
      </button>
      <div class="cards">
        <div v-for="fn in GROUP2" :key="fn.name" class="card">
          <h3>{{ fn.name }}</h3>
          <p v-if="group2[fn.name].loading">Loading…</p>
          <p v-else-if="group2[fn.name].error" class="error">{{ group2[fn.name].error }}</p>
          <pre v-else-if="group2[fn.name].data">{{ JSON.stringify(group2[fn.name].data, null, 2) }}</pre>
          <p v-else class="muted">Not called yet.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: system-ui, sans-serif;
  text-align: left;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.card {
  border: 1px solid #999;
  border-radius: 8px;
  padding: 1rem;
  flex: 1 1 220px;
  min-width: 220px;
}

.card h3 {
  margin-top: 0;
  font-size: 1rem;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.85rem;
}

.error {
  color: #d33;
}

.muted {
  color: #888;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
