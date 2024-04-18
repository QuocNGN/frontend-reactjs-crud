# Tài liệu thực hành ReactJS + ASP.NET Core Web API

Dự án của bạn là một ứng dụng web CRUD sử dụng công nghệ `ReactJS` cho phần giao diện người dùng, kết hợp với `ASP.NET WebAPI` làm backend để xử lý logic và truy xuất dữ liệu từ cơ sở dữ liệu `SQL Server`.

## Front-end

### Cài đặt các thư viện với `ReactJS` và câu lệnh

- [ReactJS với VITE](https://vitejs.dev/) - `# npm create vite@latest`
<!-- - [React router DOM v6](https://reactrouter.com/en/main/start/tutorial) - `# npm i react-router-dom` -->
- [React-Bootstrap](https://react-bootstrap.netlify.app/docs/getting-started/introduction) - `# npm install react-bootstrap bootstrap`
- [React-Toastify](https://github.com/fkhadra/react-toastify) - `# npm i react-toastify`
- [Axios](https://www.npmjs.com/package/axios) - `# npm i axios`

- [**Link Source Frontend** (src)](https://github.com/QuocNGN/frontend-reactjs-crud)

## Back-end

- [**Link Source Backend** (src)](https://github.com/QuocNGN/backend-aspnet-webapi-crud)

### Cài đặt các Nuget Packages với `ASP.Net Core Web API`

- `Microsoft.EntityFrameworkCore -version 7.0.12`
- `Microsoft.EntityFrameworkCore.Tools -version 7.0.12`
- `Microsoft.EntityFrameworkCore.SqlServer -version 7.0.12`
- `Microsoft.AspNetCore.Mvc.Core -version 2.1.38`

## Kết nối ASP.Net Web API với SQL Server

`File: appsettings.json` chuỗi config:

```JSON
  "ConnectionStrings": {
    "Name_Connect": "server=(Your_Name_Server); database=Employees; Integrated Security=True; MultipleActiveResultSets=true; TrustServerCertificate=True;"
  }
```

`File: Program.cs`: Thao tác và đăng ký kết nối SQL Server

```C#
// Register Service
builder.Services.AddDbContext<EmployeeContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("Name_Connect")));

builder.Services.AddCors();

// Configure the HTTP request pipeline.

// CORS
app.UseCors(builder =>
{
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
});
```

Thao tác tạo **Folder Migration** (_quản lý thông tin, lịch sử kết nối_): <br>
`Menu Bar: Tools > NuGet Package Manager > Package Manager Console` <br>
**Command**: <br>

```C#
$ Add-Migration intial //Kết nối SQL và ASP.Net Web API
```

```C#
$ update-database //Tự động tạo bảng trong database qua code
```

## Get All Employees: `/Employee`

Method: **GET**

```C#
[HttpGet]
public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
{
    if (_employeeContext.Employees == null)
    {
        return NotFound();
    }
    return await _employeeContext.Employees.ToListAsync();
}
```

## Get An Employee: `/Employee/id`

Method: **GET**

```C#
[HttpGet("{id}")]
public async Task<ActionResult<Employee>> GetEmployee(int id)
{
    if (_employeeContext.Employees == null)
    {
        return NotFound();
    }
    var employee = await _employeeContext.Employees.FindAsync(id);
    if (employee == null)
    {
        return NotFound();
    }
    return employee;
}
```

## Create An Employee: `/Employee`

Method: **POST**

```C#
[HttpPost]
public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
 {
     _employeeContext.Employees.Add(employee);
     await _employeeContext.SaveChangesAsync();

     return CreatedAtAction(nameof(GetEmployees), new {id = employee.ID}, employee);
 }
```

## Edit An Employee: `/Employee/id`

Method: **PUT**

```C#
[HttpPut("{id}")]
public async Task<ActionResult<Employee>> EditEmployee(int id, Employee employee)
{
    if (id != employee.ID)
    {
        return BadRequest();
    }
    _employeeContext.Entry(employee).State = EntityState.Modified;
    try
    {
        await _employeeContext.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        throw;
    }
    return Ok();
}
```

## Delete An Employee: `/Employee/id`

Method: **DELETE**

```C#
[HttpDelete("{id}")]
public async Task<ActionResult> DeleteEmployee(int id)
{
    if(_employeeContext.Employees == null)
    {
        return NotFound();
    }
    var employee = await _employeeContext.Employees.FindAsync(id);
    if (employee == null)
    {
        return NotFound();
    }
    _employeeContext.Employees.Remove(employee);
    await _employeeContext.SaveChangesAsync();

    return Ok();
}
```
