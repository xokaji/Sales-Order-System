namespace SalesOrderApp.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ItemDto>>> GetAll([FromQuery] string? search, CancellationToken ct)
    {
        return Ok(await _itemService.GetAllAsync(search, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ItemDto>> GetById(int id, CancellationToken ct)
    {
        return Ok(await _itemService.GetByIdAsync(id, ct));
    }

    [HttpGet("by-code/{itemCode}")]
    public async Task<ActionResult<ItemDto>> GetByCode(string itemCode, CancellationToken ct)
    {
        var item = await _itemService.GetByCodeAsync(itemCode, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<ItemDto>> Create([FromBody] CreateItemDto dto, CancellationToken ct)
    {
        var created = await _itemService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
