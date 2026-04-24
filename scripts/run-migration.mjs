import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function runMigration() {
  try {
    console.log('[Migration] Starting database setup...')
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'setup-database.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec', { sql: migrationSQL })
    
    if (error) {
      // If exec doesn't work, try executing statements individually
      console.log('[Migration] exec RPC not available, splitting statements...')
      
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      for (const statement of statements) {
        console.log(`[Migration] Executing: ${statement.substring(0, 50)}...`)
        const { error: stmtError } = await supabase.from('_sql').select('*').single().then(
          () => ({ error: null }),
          (err) => ({ error: err })
        )
        
        // This approach won't work, so we'll use a different strategy
        break
      }
      
      throw new Error('Database setup requires manual execution in Supabase SQL Editor')
    }
    
    console.log('[Migration] ✓ Database setup completed successfully!')
    
  } catch (error) {
    console.error('[Migration] Error:', error.message)
    console.log('\n[Migration] Please run the SQL manually:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Click "New Query"')
    console.log(`4. Copy the contents of ${migrationPath}`)
    console.log('5. Run the query')
    process.exit(1)
  }
}

runMigration()
