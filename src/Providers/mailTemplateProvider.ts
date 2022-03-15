
import { promises } from 'fs';
import Handlebars from 'handlebars';
import { resolve } from 'path';
import GenericExceptionHandler, { StausCode } from '../Exceptions/Generic';

interface ITemplateVaariables {
  [key: string]: string | number;
}

interface IParseMailTemplateDTO {
  filename: string;
  variables: ITemplateVaariables;
}

export default class MailTemplateProvider {
    /**
     * 
     * @param param0 
     *  Is passed a object as params.
     *   filename: example test.hbs
     *   variables is a object containning variables to insert in passed file.
     * @returns Returna parsed html.
     */
  public async parse({
    filename,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateDir = await this.checkIfFileExists(filename);

    const templateFileContent = await promises.readFile(templateDir, {
      encoding: 'utf-8',
    });

    const parseTemplate = Handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }

  /**
   *
   * @param filename
   * Name and extension os file. EX: test.hbs
   *
   * @returns
   *  Returns a string if file exixst in templates dir.
   *  Otherwise gets error
   */
  private async checkIfFileExists(filename: string): Promise<string> {
    const templateDir = resolve(__dirname, `../views/${filename}`);
    try {
      await promises.stat(templateDir);
    } catch (err) {
      throw new GenericExceptionHandler('Invalid path for email template',StausCode.InternalServerError )
    }

    return templateDir;
  }
}
