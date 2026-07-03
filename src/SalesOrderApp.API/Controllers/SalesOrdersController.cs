namespace SalesOrderApp.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;

    public SalesOrdersController(ISalesOrderService salesOrderService)
    {
        _salesOrderService = salesOrderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetList(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool descending = true,
        CancellationToken ct = default)
    {
        var result = await _salesOrderService.GetListAsync(pageNumber, pageSize, sortBy, descending, ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SalesOrderDto>> GetById(int id, CancellationToken ct)
    {
        return Ok(await _salesOrderService.GetByIdAsync(id, ct));
    }

    [HttpPost]
    public async Task<ActionResult<SalesOrderDto>> Create([FromBody] UpsertSalesOrderDto dto, CancellationToken ct)
    {
        var created = await _salesOrderService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SalesOrderDto>> Update(int id, [FromBody] UpsertSalesOrderDto dto, CancellationToken ct)
    {
        return Ok(await _salesOrderService.UpdateAsync(id, dto, ct));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _salesOrderService.DeleteAsync(id, ct);
        return NoContent();
    }
}
