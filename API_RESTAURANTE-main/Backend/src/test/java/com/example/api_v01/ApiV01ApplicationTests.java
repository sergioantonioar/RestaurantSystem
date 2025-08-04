package com.example.api_v01;

import com.example.api_v01.dto.response.RegisterAdmin;
import com.example.api_v01.model.Admin;
import com.example.api_v01.model.Product;
import com.example.api_v01.model.User;
import com.example.api_v01.model.enums.Rol;
import com.example.api_v01.service.admin_service.AdminService;
import com.example.api_v01.service.customer_order_service.CustomerOrderService;
import com.example.api_v01.service.order_set_service.OrderSetService;
import com.example.api_v01.service.product_service.ProductService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import java.util.List;

@SpringBootTest
class ApiV01ApplicationTests {

    @Autowired
    private AdminService adminService;


    @Test
    void contextLoads() {
        System.out.println("Hello World");
    }

    //Solo se ejecuta una vez para quedar guardado en tu bd
    @Test
    void CrateAdmin() {
        RegisterAdmin registerAdmin = RegisterAdmin.builder()
                .username("admin123")
                .password("admin123")
                .name("Ash Kechup")
                .email("alss@gmail.com")
                .dni("alss@gmail.com")
                .build();

        adminService.saveAdmin(registerAdmin);
    }


}
