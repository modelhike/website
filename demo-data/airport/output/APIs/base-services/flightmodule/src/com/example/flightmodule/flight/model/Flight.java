package com.example.flightmodule.flight.model;

import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.ArrayList;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;

@Data
@Document(collection = "flights")
public class Flight {
  @Autowired
  private DatabaseClient databaseClient;
  @Autowired
  private R2dbcEntityTemplate r2dbcEntityTemplate;
  private String id;
  private Reference arrivalStation;
  private String aslot;
  private String arrivalStatus;
  private String flightKey;


  public String getPilotLevel(Integer empId) {
    var emp = r2dbcEntityTemplate.select(Employee.class)
            // where (model): e -> e.id == empId
            .first().block()
    ;
    if (emp.years < 5) {
        return "Mid-Level";
        } else {
            return "Senior";
    }

  }


}
