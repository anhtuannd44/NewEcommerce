﻿using ClosedXML.Excel;
using ECommerce.Common.CrossCuttingConcerns.Excel;
using ECommerce.Configuration.Entities;

namespace ECommerce.Configuration.Excel.ClosedXML;

public class ConfigurationEntryExcelWriter : IExcelWriter<List<ConfigurationEntry>>
{
    public void Write(List<ConfigurationEntry> data, Stream stream)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Sheet1");

        worksheet.Cell("A1").Value = "Key";
        worksheet.Cell("B1").Value = "Value";
        worksheet.Range("A1:B1").Style.Font.Bold = true;

        int i = 2;
        foreach (var row in data)
        {
            worksheet.Cell("A" + i).Value = row.Key;
            worksheet.Cell("B" + i).Value = row.Value;
            i++;
        }

        workbook.SaveAs(stream);
    }
}
