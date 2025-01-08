import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function processData() {
  try {
    console.log('\n🚀 Starting data processing pipeline...\n')

    // Run each script directly using exec
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const runScript = async (command: string) => {
      try {
        const { stdout, stderr } = await execPromise(command)
        if (stderr) console.error(stderr)
        if (stdout) console.log(stdout)
      } catch (error) {
        console.error(`Error executing ${command}:`, error)
        throw error
      }
    }

    // 1. Import CSV
    console.log('📥 Importing CSV data...')
    await runScript('npm run import')
    console.log('✅ CSV import complete\n')

    // Wait between steps
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 2. Clean Links
    console.log('🧹 Cleaning resource links...')
    await runScript('npm run clean-links')
    console.log('✅ Link cleaning complete\n')

    await new Promise(resolve => setTimeout(resolve, 1000))

    // 3. Extract URLs
    console.log('🔍 Extracting URLs...')
    await runScript('npm run extract-urls')
    console.log('✅ URL extraction complete\n')

    await new Promise(resolve => setTimeout(resolve, 1000))

    // 4. Download Assets
    console.log('📸 Downloading assets...')
    await runScript('npm run download-assets')
    console.log('✅ Asset download complete\n')

    await new Promise(resolve => setTimeout(resolve, 1000))

    // 5. Format Resources
    console.log('📝 Formatting resources...')
    await runScript('npm run format-resources')
    console.log('✅ Resource formatting complete\n')

    await new Promise(resolve => setTimeout(resolve, 1000))

    // 6. Convert to Rich Text
    console.log('✨ Converting to rich text...')
    await runScript('npm run convert-richtext')
    console.log('✅ Rich text conversion complete\n')

    console.log('🎉 All processing complete!')
  } catch (error) {
    console.error('❌ Error during processing:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

processData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 