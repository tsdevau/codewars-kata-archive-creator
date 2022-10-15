/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs"
import path from "node:path"
import { userCompletedDBPath } from "../../config/config"
import { format } from "prettier"

export async function updateUserCompletedDB(fullUserCompletedList: any): Promise<void> {
  /** Write update to completed Kata database file with latest API import data
   * This adds new Katas and additional languages completed since last import
   * @Param const fullUserCompletedList
   **/
  fs.writeFile(
    path.join(userCompletedDBPath),
    format(`export const userCompletedDB = ${JSON.stringify(fullUserCompletedList)}`, {
      semi: false,
      printWidth: 125,
      trailingComma: "none",
      parser: "typescript"
    }),
    { flag: "w", encoding: "utf8", mode: 644 },
    (error) => {
      if (error) {
        console.error(`Error from updateUserCompleteDB in ${path.basename(__filename)}`)
        throw Error(`Error writing ${userCompletedDBPath}\n${error}`)
      }
      console.log(`Updating of ${userCompletedDBPath} was successful`)
    }
  )
  return
}

export function createKataRootDir(kataDetails: any): void {
  /** Create individual Kata root directory that will hold each completed
   * language specific directory related to the Kata
   **/
  try {
    fs.mkdirSync(kataDetails.kataPath, { recursive: true, mode: 755 })
  } catch (error) {
    console.error(`Error from createKataRootDir() in ${path.basename(__filename)}`)
    throw Error(`Error creating ${kataDetails.kataPath}\n${error}`)
  }
  console.log(`${kataDetails.kataPath} is ready`)
  return
}

export function createLangDir(kataDetails: any, langPath: string): void {
  // Create individual Kata language path
  try {
    fs.mkdirSync(langPath, { recursive: true, mode: 755 })
  } catch (error) {
    console.error(`Error from createLangDir() in ${path.basename(__filename)}`)
    throw Error(`Error creating ${kataDetails.slug}/${kataDetails.curLang}\n${error}`)
  }
  console.log(`${kataDetails.slug}/${kataDetails.curLang} is ready`)
  return
}

export function writeKataMarkdownFile(kataDetails: any, mdString: string): void {
  /** Call to generate Kata markdown description layout & write file to disk
   * !Currently set to OVERWRITE existing markdown description
   **/
  fs.writeFile(path.join(kataDetails.kataPath, `${kataDetails.slug}.md`), mdString, { flag: "w", mode: 644 }, (error) => {
    if (error) {
      console.error(`Error from writeKataMarkdownFile(...) in ${path.basename(__filename)}`)
      throw Error(`Error writing ${kataDetails.slug}.md\n${error}`)
    }
  })
  console.log(`Writing of markdown description file for ${kataDetails.slug} successful.`)
  return
}

export function writeUserSolutionFile(kataData: any, langPath: string, langFilename: string, langExt: string): void {
  /** Write user solution code block/s to file
   * ?Currently set so it will NOT overwrite an existing file
   * ?With this setting, new solutions for an existing language will be lost
   **/
  fs.writeFile(
    path.join(langPath, `${langFilename}.${langExt}`),
    kataData.code,
    { flag: "wx", encoding: "utf8", mode: 644 },
    (error) => {
      if (error) {
        if (error.code === "EEXIST") {
          console.warn(`${langFilename}.${langExt} CODE file already exists and was NOT overwritten.`)
          return
        }
        console.warn(`WARNING from writeUserSolutionFile(...) in ${path.basename(__filename)}`)
        console.warn(`While writing ${langFilename}.${langExt} CODE file\n${error}`)
      } else {
        console.log(`Writing of ${langFilename}.${langExt} CODE file was successful.`)
      }
    }
  )
  return
}

export function writeTestFile(kataData: any, langPath: string, langFilename: string, langExt: string): void {
  /** Write test code block/s to file
   * ?Currently set so it will NOT overwrite an existing file
   * ?With this setting, no updates or changes to tests for an existing language will occur
   **/
  fs.writeFile(
    path.join(
      langPath,
      kataData.curLang === "python" ? `${langFilename}_test.${langExt}` : `${langFilename}.Test.${langExt}`
    ),
    kataData.tests,
    { flag: "wx", encoding: "utf8", mode: 644 },
    (error) => {
      if (error) {
        if (error.code === "EEXIST") {
          console.warn(`${langFilename}.${langExt} TEST file already exists and was NOT overwritten.`)
          return
        }
        console.warn(`WARNING from writeTestFile(...) in ${path.basename(__filename)}`)
        console.warn(`While writing ${langFilename}.${langExt} TEST file\n${error}`)
      } else {
        console.log(`Writing of ${langFilename}.${langExt} TEST file was successful.`)
      }
    }
  )
  return
}
