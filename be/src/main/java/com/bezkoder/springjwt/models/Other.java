package com.bezkoder.springjwt.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class Other {
    private Date fromDate;
    private Date endDate;

    public boolean check(Other x)
    {
        if(checkBefore(x.endDate,this.fromDate) || checkBefore(this.endDate,x.fromDate))
        {
            return false;
        }else {
            return true;
        }

    }
    public boolean checkBefore(Date dateBefore, Date dateAfter)
    {
        if(dateBefore ==null || dateAfter ==null)
        {
            return false;
        }else{
            return !dateBefore.after(dateAfter);
        }
    }
}
