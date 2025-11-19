using System;
using System.Runtime.InteropServices.JavaScript;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Validation;
using System.IO;
using System.Dynamic;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;

enum DocFormat { docx, xlsx, pptx };

public partial class Docxidator
{
    [RequiresUnreferencedCode("Calls System.Collections.Generic.List<T>.Add(T)")]
    internal static string GetValidationErrorsData(IEnumerable<ValidationErrorInfo> results)
    {
        List<dynamic> res = new List<dynamic>();

        foreach (ValidationErrorInfo validationErrorInfo in results)
        {
            dynamic dyno = new ExpandoObject();
            dyno.Description = validationErrorInfo.Description;
            dyno.Path = validationErrorInfo.Path;
            dyno.Id = validationErrorInfo.Id;
            dyno.ErrorType = validationErrorInfo.ErrorType;
            res.Add(dyno);
        }

        string json = JsonConvert.SerializeObject(
            res,
            Formatting.None,
            new JsonSerializerSettings()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            }
        );

        return json;
    }

    internal static OpenXmlPackage GetDocument(DocFormat format, Stream stream)
    {
        if (format == DocFormat.pptx)
        {
            return PresentationDocument.Open(stream, false);
        }
        else if (format == DocFormat.xlsx)
        {
            return SpreadsheetDocument.Open(stream, false);

        }
        else
        {
            return WordprocessingDocument.Open(stream, false);
        }
    }

    [JSExport]
    [RequiresUnreferencedCode("Calls Docxidator.GetValidationErrorsData(IEnumerable<ValidationErrorInfo>)")]
    internal static string Process(Int32 id, string formatRaw, string officeVersionRaw)
    {
        var file = GetFile(id);
        Enum.TryParse(officeVersionRaw, out FileFormatVersions officeVersion);
        Enum.TryParse(formatRaw, out DocFormat format);

        var v = new OpenXmlValidator(officeVersion);
        var stream = new MemoryStream(file);
        var document = GetDocument(format, stream);
        var errs = v.Validate(document);
        return Docxidator.GetValidationErrorsData(errs);
    }

    [JSImport("getFile", "index.js")]
    internal static partial byte[] GetFile(Int32 id);
}
