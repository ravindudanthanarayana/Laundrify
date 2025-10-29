package com.example.laundry.controller.dto;

import com.example.laundry.model.User;

public class UserDto {
    private Long id; private String email; private String name; private String role; private String phone;
    public static UserDto from(User u){ var d=new UserDto();
        d.id=u.getId(); d.email=u.getEmail(); d.name=u.getName(); d.role=u.getRole(); d.phone=u.getPhone(); return d; }
    public Long getId(){return id;} public String getEmail(){return email;} public String getName(){return name;}
    public String getRole(){return role;} public String getPhone(){return phone;}
    public void setId(Long v){id=v;} public void setEmail(String v){email=v;} public void setName(String v){name=v;}
    public void setRole(String v){role=v;} public void setPhone(String v){phone=v;}
}
