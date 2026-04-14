package com.example.flightmodule.station.model;

import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.ArrayList;
import lombok.Data;

@Data
@Document(collection = "stations")
public class Station {
  private String id;
  private String code;


}
